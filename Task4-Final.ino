
// RemoteXY select connection mode and include library 
#define REMOTEXY_MODE__ESP8266_HARDSERIAL_POINT


// RemoteXY connection settings 
#define REMOTEXY_SERIAL Serial
#define REMOTEXY_SERIAL_SPEED 115200 
#define REMOTEXY_WIFI_SSID "RemoteXY"
#define REMOTEXY_WIFI_PASSWORD "12345678"
#define REMOTEXY_SERVER_PORT 6377
#define USE_ARDUINO_INTERRUPTS true    // Set-up low-level interrupts for most acurate BPM math
#include <PulseSensorPlayground.h>
#include <Wire.h>
#include <MPU6050.h>
#include <DHT.h>
#define DHTPIN 9
const int MPU_addr = 0x68;
MPU6050 mpu;
const int button1Pin = 13; // Define the pin for button 1
const int button2Pin = 12; // Define the pin for button 2
const int button3Pin = 11; // Define the pin for button 2
const int button4Pin = 10; // Define the pin for button 2

#include <RemoteXY.h>

// RemoteXY configurate  
#pragma pack(push, 1)
uint8_t RemoteXY_CONF[] =   // 100 bytes
  { 255,2,0,0,0,93,0,17,0,0,0,184,1,106,200,1,1,8,0,130,
  24,49,58,121,0,16,130,33,125,42,41,0,30,130,33,66,42,41,0,30,
  1,42,74,24,24,1,184,31,0,129,14,28,79,14,31,68,97,114,32,69,
  108,32,70,111,117,97,100,0,129,35,53,37,12,183,66,117,122,122,101,114,
  0,1,41,133,24,24,1,184,31,0,129,43,113,22,12,183,76,69,68,0 };
  
// this structure defines all the variables and events of your control interface 
struct {

    // input variables
  uint8_t buzzer; // =1 if button pressed, else =0
  uint8_t LED; // =1 if button pressed, else =0

    // other variable
  uint8_t connect_flag;  // =1 if wire connected, else =0

} RemoteXY;
#pragma pack(pop)
const int zpin = A1;     
const int xpin = A5; 
const int ypin = A4;           
const int PulseWire = A3;       // 'S' Signal pin connected to A0
const int LED13 = 13;          // The on-board Arduino LED
int Threshold = 550;           // Determine which Signal to "count as a beat" and which to ignore
                               
PulseSensorPlayground pulseSensor;  // Creates an object

const int sensorPin = A5; //pin A0 to read analog input

#define DHT11_PIN 7
#define PIN_BUZZER 6
#define PIN_LED 7
#define TILT_SENSOR_PIN 5
//int prevstate = HIGH;
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);


void setup() 
{

  RemoteXY_Init (); 
  
  
  dht.begin();

  pinMode (PIN_BUZZER, OUTPUT);
  pinMode (PIN_LED, OUTPUT);
  pinMode(TILT_SENSOR_PIN, INPUT);
  // TODO you setup code
  pulseSensor.analogInput(PulseWire);   
	pulseSensor.blinkOnPulse(LED13);       // Blink on-board LED with heartbeat
	pulseSensor.setThreshold(Threshold);   

	// Double-check the "pulseSensor" object was created and began seeing a signal

 Wire.begin();
 Wire.beginTransmission(MPU_addr);
 Wire.write(0x6B); // PWR_MGMT_1 register
 Wire.write(0);     // set to zero (wakes up the MPU-6050)
 Wire.endTransmission(true);
 Serial.begin(9600);
}

void loop() 
{ 
  // RemoteXY_Handler ();
 Wire.beginTransmission(MPU_addr);
 Wire.write(0x3B); // starting with register 0x3B (ACCEL_XOUT_H)
 Wire.endTransmission(false);
 Wire.requestFrom(MPU_addr, 14, true); // request a total of 14 registers

 // Read accelerometer data
 int16_t AcX = Wire.read() << 8 | Wire.read(); // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)
 int16_t AcY = Wire.read() << 8 | Wire.read(); // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
 int16_t AcZ = Wire.read() << 8 | Wire.read(); // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)

 // Read gyroscope data
 int16_t GyX = Wire.read() << 8 | Wire.read(); // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
 int16_t GyY = Wire.read() << 8 | Wire.read(); // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
 int16_t GyZ = Wire.read() << 8 | Wire.read(); // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)

 // Print the values to the Serial Monitor
 
 int x=analogRead(xpin); Serial.print(x); Serial.print(",");
 int y=analogRead(xpin); Serial.print(y);Serial.print(",");


   // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit
  float f = dht.readTemperature(true);
  
  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index
  // Must send in t in Fahrenheit!
  float hi = dht.computeHeatIndex(f, h); 
  Serial.print(h);
  Serial.print(","); 
  Serial.print(t);
  Serial.print(",");
  Serial.print(f);
  Serial.print(",");
  Serial.print(hi);
  Serial.print(",");

  // Read the value from the tilt sensor
 int tiltSensorValue = digitalRead(TILT_SENSOR_PIN);
 //If the sensor is tilted, turn on the LED and the buzzer
 if (tiltSensorValue == LOW) {
    digitalWrite(PIN_LED, HIGH);
    digitalWrite(PIN_BUZZER, HIGH);
    delay(200); // Delay for a short period to allow the buzzer to sound
    digitalWrite(PIN_BUZZER, LOW);
    
    delay(200);
    
 } else if (tiltSensorValue == HIGH)  {
    // If the sensor is not tilted, turn off the LED and the buzzer based on RemoteXY control
     digitalWrite(PIN_BUZZER, LOW);
     digitalWrite(PIN_LED, LOW);
  
  }

//   int myBPM = 1;
//    myBPM = pulseSensor.getBeatsPerMinute();      // Calculates BPM

// 	if (pulseSensor.sawStartOfBeat()) {               // Constantly test to see if a beat happened
// 		Serial.print(myBPM);  
//     Serial.print(",");                      // Print the BPM value
// 		}
//   else {
//     long myBPM= random(90,120);
//     Serial.print(myBPM);  
//     Serial.print(",");
//   }
  int button1State = digitalRead(button1Pin); // Read state of button 1
  int button2State = digitalRead(button2Pin); // Read state of button 2
  int button3State = digitalRead(button3Pin); // Read state of button 3
  int button4State = digitalRead(button4Pin); // Read state of button 4

  

  // Read state of additional buttons

  if (button1State == HIGH) {
    int button_pressed = 1;
     // Print message when button 1 is pressed
    Serial.print(button_pressed);
    
  }

  else if (button2State == HIGH) {
    int button_pressed = 2;
     // Print message when button 2 is pressed
    Serial.print(button_pressed);
    
  }

  else if (button3State == HIGH) {
    int button_pressed = 3;
     // Print message when button 3 is pressed
    Serial.print(button_pressed);
    
  }

  else if (button4State == HIGH) {
    int button_pressed = 4;
     // Print message when button 4 is pressed
    Serial.print(button_pressed);
    
  }

  else {
    int button_pressed=0;
    Serial.print(button_pressed);
    
  }
  // Add conditions for additional buttons
  // delay before next reading:
  Serial.println();
  // delay(1500);
  delay(1500);
  // int currentstate=digitalRead(tilt);
  // if (currentstate == LOW && prevstate == HIGH){
  //   digitalWrite(PIN_LED, HIGH);
  //   digitalWrite(PIN_BUZZER, HIGH);
  //   // delay(800);
  //   // digitalWrite(PIN_LED, LOW);
  //   // digitalWrite(PIN_BUZZER, LOW);
  //   // delay(800);
  //   digitalWrite(PIN_BUZZER, (RemoteXY.buzzer==1)?LOW:HIGH);
  //   digitalWrite(PIN_LED, (RemoteXY.LED==1)?LOW:HIGH);
  // }
   
  // digitalWrite(PIN_BUZZER, (RemoteXY.buzzer==1)?LOW:HIGH);
  // digitalWrite(PIN_LED, (RemoteXY.LED==1)?LOW:HIGH);
  
  // TODO you loop code
  // use the RemoteXY structure for data transfer
  // do not call delay(), use instead RemoteXY_delay() 

}