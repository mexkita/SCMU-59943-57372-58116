#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h> // LCD library
#include <Wire.h> 

// Carolina wifi
#define WIFI_SSID "NOS-FE0D"
#define WIFI_PASSWORD "6GSPUSQ2"

// LCD Display pins
#define SDA 13
#define SCL 14

// Proximity Ultrasonic Sensor 
#define trigPin 12 // define trigPin
#define echoPin 33 // define echoPin.
#define MAX_DISTANCE 700 // Maximum sensor distance is rated at 400-500cm.
float timeOut = MAX_DISTANCE * 60;
int soundVelocity = 340; 
float sonarResult;

// RGB LED
const byte ledPins[] = {15, 2, 4}; // define red, green, blue led pins
#define RGBDistanceTrigger 50.0

// ENDPOINTS for backend requests
#define ENTRANCE_OR_EXIT_PARK_URL "http://192.168.1.11:8080/api/park/012345" //http://localhost:8080/api/park/{parkId}

// Instantiate I2C LCD1602 screen
LiquidCrystal_I2C lcd(0x3F,16,2); 

// used for json bodies
char jsonOutput[128];

void setup() 
{
  Serial.begin(115200);

  // LCD setup
  lcdSetup();

  // Proximity Ultrasonic Sensor setup
  pinMode(trigPin,OUTPUT);  // set trigPin to output mode
  pinMode(echoPin,INPUT);   // set echoPin to input mode

  // RGB LED setup
  for (int i = 0; i < 3; i++) {       
    if (!ledcAttach(ledPins[i], 1000, 8)) {
      Serial.println("Error attaching LEDC pin");
    }
  }

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");

  while(WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println();


}

void loop() 
{
  if(WiFi.status() == WL_CONNECTED)
  {
    //entranceAndExitParkMethod("normal", false);
  }
  else
  {
    Serial.println("Connection lost");
  }

  //delay(10000);

  delay(500);

  getSonarDistance();
  
  setRGBLedColor();
}

void lcdSetup() {
  Wire.begin(SDA, SCL);           // attach the IIC pin
  lcd.init();                     // LCD driver initialization
  lcd.backlight();                // Open the backlight
  lcd.setCursor(0,0);             // Move the cursor to row 0, column 0
  lcd.print("Free Spots:");
  lcd.setCursor(0,1);
  lcd.print(50); //get value from backend
}

void getSonarDistance() {
  Serial.printf("Distance: ");
  sonarResult = getSonar();
  Serial.print(sonarResult); // Send ping, get distance in cm and print result
  Serial.println("cm");
}

float getSonar() {
 unsigned long pingTime;
 float distance;
 // make trigPin output high level lasting for 10μs to triger HC_SR04？
 digitalWrite(trigPin, HIGH);
 delayMicroseconds(10);
 digitalWrite(trigPin, LOW);
 // Wait HC-SR04 returning to the high level and measure out this waitting time
 pingTime = pulseIn(echoPin, HIGH, timeOut);
 // calculate the distance according to the time
 distance = (float)pingTime * soundVelocity / 2 / 10000;
 return distance; // return the distance value
}

void setRGBLedColor() {
  if (sonarResult > RGBDistanceTrigger) { // red
    ledcWrite(ledPins[0], 255); 
    ledcWrite(ledPins[1], 0);
    ledcWrite(ledPins[2], 0);
  } else {                                // green
    ledcWrite(ledPins[0], 0); 
    ledcWrite(ledPins[1], 255);
    ledcWrite(ledPins[2], 0);
  }
}


// PUT
// path -> parkId  
// body -> "spot_type" ("normal" or "reserved") and "status" (true for entrance, false for exit)
void entranceAndExitParkMethod(String spotType, bool status) {
  HTTPClient client;

    client.begin(ENTRANCE_OR_EXIT_PARK_URL); 
    client.addHeader("Content-Type", "application/json");

    const size_t CAPACITY = JSON_OBJECT_SIZE(2); // number of attributes in body
    StaticJsonDocument<CAPACITY> doc;

    JsonObject object = doc.to<JsonObject>();

    object["spot_type"] = spotType;
    object["status"] = status;
    
    serializeJson(doc, jsonOutput);
    Serial.println(jsonOutput);

    int httpCode = client.PUT(String(jsonOutput));

    if(httpCode > 0) {
      String payload = client.getString();
      Serial.println("\nStatusCode: " + String(httpCode));
      Serial.println(payload);
    }
    Serial.println(".");
    Serial.println(httpCode);
}

