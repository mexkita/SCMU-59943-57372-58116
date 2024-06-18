#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h> // LCD library
#include <Wire.h> 
#include <ESP32Servo.h>
#include <SPI.h>
#include <MFRC522.h>

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
#define trigPin 12 // digital pin
#define echoPin 13 // digital pin
#define MAX_DISTANCE 700 // Maximum sensor distance is rated at 400-500cm.
float timeOut = MAX_DISTANCE * 60;
int soundVelocity = 340; 
float sonarResult;

// RGB LED
const byte ledPins[] = {25, 26, 27}; // define red, green, blue led pins
#define RGBDistanceTrigger 50.0

// Servo 180
Servo myservo;
#define servoPin 14 // Servo motor pin
unsigned long servoStartTime = 0;
bool servoActive = false;
// bool servoMoving = false;  // -> used in rotateServo()
// int servoState = 0;        // -> used in rotateServo()

// RFID sensor
#define SS_PIN 5
#define RST_PIN 0
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key; 
byte nuidPICC[4];   // Init array that will store new NUID 
String scannedUserId = "zPTzVFDLOhVyKGJeu97h0At0Aq92";

// ENDPOINTS for backend requests
// const String ENTRANCE_OR_EXIT_PARK_URL = String("http://192.168.1.8:8080/api/park/") + THIS_PARK_ID; //http://localhost:8080/api/park/{parkId}
const String GET_PARK_FREE_SPOTS = String("http://192.168.1.11:8080/api/park/available_spots/") + THIS_PARK_ID;
String START_PARKING = String("http://192.168.1.11:8080/api/users/start_stay/"); // add userId + '/parks/' + parkingId

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

  // Servo 180 setup
  myservo.setPeriodHertz(50); // standard 50 hz servo
  myservo.attach(servoPin, 500, 2500); // attaches the servo on servoPin to the servo object

  /////////////////// RFID sensor setup //////////////////////////////
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522 

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }

  Serial.println(F("This code scan the MIFARE Classsic NUID."));
  Serial.print(F("Using the following key:"));
  printHex(key.keyByte, MFRC522::MF_KEY_SIZE);
  ///////////////////////////////////////////////////////////////////

  // Connect WiFi
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

  // rotate servo (open the barrier) when scann is 200 and freeSpots > 0
  // rotateServo();

  handleRFID();
   
  handleServo();
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

// void rotateServo() {
//   unsigned long currentMillis = millis();

//   if (!servoMoving) {
//     servoMoving = true;
//     servoStartTime = currentMillis;
//     servoState = 0;
//     myservo.write(0);
//   } else {
//     switch (servoState) {
//       case 0:
//         if (currentMillis - servoStartTime >= 1000) { // wait for 1 second
//           myservo.write(90);
//           servoStartTime = currentMillis;
//           servoState = 1;
//         }
//         break;

//       case 1:
//         if (currentMillis - servoStartTime >= 3000) { // wait for 200 milliseconds
//           servoMoving = false;
//         }
//         break;
//     }
//   }
// }

void handleServo() {
  if (servoActive) {
    unsigned long currentMillis = millis();
    if (currentMillis - servoStartTime >= 2000) { // Step 2: Wait 2 seconds
      myservo.write(90); // Step 3: Rotate servo back to 90 degrees
      servoActive = false; // End the servo cycle
    }
  }
}

void handleRFID() {
    // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been readed
  if ( ! rfid.PICC_ReadCardSerial())
    return;

  Serial.print(F("PICC type: "));
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.println(rfid.PICC_GetTypeName(piccType));

  // Check is the PICC of Classic MIFARE type
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI && 
    piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
    piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    Serial.println(F("Your tag is not of type MIFARE Classic."));
    return;
  }
  ////////////////////////////////////////
  //////////////////////////////////////// rodar servo 
  /////////////////////////////////////////
  handleStartParking();

  if (rfid.uid.uidByte[0] != nuidPICC[0] || 
    rfid.uid.uidByte[1] != nuidPICC[1] || 
    rfid.uid.uidByte[2] != nuidPICC[2] || 
    rfid.uid.uidByte[3] != nuidPICC[3] ) {
    Serial.println(F("A new card has been detected."));

    // Store NUID into nuidPICC array
    for (byte i = 0; i < 4; i++) {
      nuidPICC[i] = rfid.uid.uidByte[i];
    }
   
    Serial.println(F("The NUID tag is:"));
    Serial.print(F("In hex: "));
    printHex(rfid.uid.uidByte, rfid.uid.size);
    Serial.println();
    Serial.print(F("In dec: "));
    printDec(rfid.uid.uidByte, rfid.uid.size);
    Serial.println();
  }
  else Serial.println(F("Card read previously."));

  // Authenticate using key A
  MFRC522::StatusCode status;
  byte buffer[18];
  byte block = 4; // The block you want to read from
  byte trailerBlock = block + 3; // The trailer block contains the access conditions for the sector
  status = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(rfid.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(rfid.GetStatusCodeName(status));
    return;
  }

  // Read the block
  byte bufferSize = sizeof(buffer);
  status = rfid.MIFARE_Read(block, buffer, &bufferSize);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Read() failed: "));
    Serial.println(rfid.GetStatusCodeName(status));
    return;
  }

  // Print the data
  Serial.print(F("Data in block "));
  Serial.print(block);
  Serial.print(F(": "));
  for (byte i = 0; i < 16; i++) {
    Serial.write(buffer[i]);
  }
  Serial.println();

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();
}

/**
 * Helper routine to dump a byte array as hex values to Serial. 
 */
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
    scannedUserId.concat(String(buffer[i] < 0x10 ? " 0" : " "));
    scannedUserId.concat(String(buffer[i], HEX));
  }
}

/**
 * Helper routine to dump a byte array as dec values to Serial.
 */
void printDec(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], DEC);
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

        // Parse the JSON payload
        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, payload);

        if (!error) {
          int newFreeSpotsValue = doc["normal_spots"];
          if(freeSpots != -1 && newFreeSpotsValue > freeSpots){
            servoActive = true;
            servoStartTime = millis();
            myservo.write(0);
          }
          freeSpots = newFreeSpotsValue;
          // Update freeSpots
          lcd.setCursor(0, 1);
          lcd.print(freeSpots);
        } else {
          Serial.print("deserializeJson() failed: ");
          Serial.println(error.c_str());
        }
      }
    }
}

void handleStartParking() {
  HTTPClient client;
  //String ENDPOINT_URL = START_PARKING + scannedUserId + "/parks/" + THIS_PARK_ID;
  client.begin("http://192.168.1.11:8080/api/users/start_stay/zPTzVFDLOhVyKGJeu97h0At0Aq92/parks/012345");
  int httpCode = client.POST("");
  Serial.println("\nStatusCode: " + String(httpCode));

  if (httpCode > 0) {
    String payload = client.getString();
    Serial.println(payload);

    client.end();

    if (httpCode >= 200 && httpCode <= 250) {
      servoActive = true;
      servoStartTime = millis();
      myservo.write(0);
    }
  }
  else {
    Serial.println("Error on HTTP request");
  }
}
