#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h> // LCD library
#include <Wire.h> 
#include <ESP32Servo.h>

// we're assumming that our physical prototype has the following ID for every endpoint call we make
#define THIS_PARK_ID "012345"

// Carolina wifi
#define WIFI_SSID "NOS-FE0D"
#define WIFI_PASSWORD "6GSPUSQ2"

// LCD Display pins
#define SDA 33
#define SCL 32
int freeSpots = -1;
unsigned long lastGetFreeSpotsTime = 0;
const unsigned long getFreeSpotsInterval = 5000; // 5 seconds

// Instantiate I2C LCD1602 screen
LiquidCrystal_I2C lcd(0x3F,16,2);

// Proximity Ultrasonic Sensor 
#define trigPin 18 // digital pin
#define echoPin 19 // digital pin
#define MAX_DISTANCE 700 // Maximum sensor distance is rated at 400-500cm.
float timeOut = MAX_DISTANCE * 60;
int soundVelocity = 340; 
float sonarResult;

// RGB LED
const byte ledPins[] = {25, 26, 27}; // define red, green, blue led pins
#define RGBDistanceTrigger 50.0

// ENDPOINTS for backend requests
// const String ENTRANCE_OR_EXIT_PARK_URL = String("http://192.168.1.8:8080/api/park/") + THIS_PARK_ID; //http://localhost:8080/api/park/{parkId}
const String GET_PARK_FREE_SPOTS = String("http://192.168.1.8:8080/api/park/available_spots/") + THIS_PARK_ID;

// used for json bodies
// char jsonOutput[128];

void setup() 
{
  Serial.begin(115200);

  // LCD setup
  lcdSetup();

  // Proximity Ultrasonic Sensor setup
  pinMode(trigPin, OUTPUT);  // set trigPin to output mode
  pinMode(echoPin, INPUT);   // set echoPin to input mode

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

  Serial.println("setup complete");
}

void loop() 
{

  if(WiFi.status() == WL_CONNECTED)
  {
    unsigned long currentMillis = millis();
    //entranceAndExitParkMethod("normal", false);
    handleGetFreeSpots(currentMillis);
  }
  else
  {
    Serial.println("Connection lost");
  }

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
  lcd.print(freeSpots); //get value from backend
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

void handleGetFreeSpots(unsigned long currentMillis) {
  if (currentMillis - lastGetFreeSpotsTime >= getFreeSpotsInterval) {
      lastGetFreeSpotsTime = currentMillis;

      HTTPClient client;
      client.begin(GET_PARK_FREE_SPOTS);
      int httpCode = client.GET();
      Serial.println("\nStatusCode: " + String(httpCode));

      if (httpCode > 0) {
        String payload = client.getString();
        Serial.println(payload);

        // update freeSpots 
        freeSpots++;
        lcd.setCursor(0,1);
        lcd.print(freeSpots);
      }
    }
}
