// SERIAL COMUNICATION //
// a string to hold incoming data
String inputString = "";
// whether the message is complete
boolean received = false;

// ANALOG SENSORS //
#define SENS_SOUND_GLOB A0
#define SENS_PHOTO_DOWN A1
#define SENS_PHOTO_UP A2
int sensSoundGlob = 0;
int sensPhotoDown = 0;
int sensPhotoUp = 0;
// DIGITAL SENSORS //
#define SENS_SOUND_INTE 4
#define SENS_PIR 5
byte sensSoundInte = 0;
byte sensPir = 0;
// sensor timer
unsigned long lastSensorReading = 0;

// REALYS (SmartTint) //
#define RELAY_CH1 34
#define RELAY_CH2 35
#define RELAY_CH3 36
#define RELAY_CH4 37
#define RELAY_CH5 38
#define RELAY_CH6 39
#define RELAY_CH7 40
#define RELAY_CH8 41
// for storing the relays values
byte relays[8];
int which = RELAY_CH1;
// swing time
unsigned long lastRelayOn = 0;

// DIMERS (Bulbs) //
#include <TimerThree.h>
#define DIMER_CH1 24
#define DIMER_CH2 25
#define DIMER_CH3 26
#define DIMER_CH4 27
#define DIMER_CH5 28
#define DIMER_CH6 29
#define DIMER_CH7 30
#define DIMER_CH8 31
// for storing the dimer values
// 2 varibles are used for smothing transitions:
// first is the dessired value, second is the real
// showed value dimming towards the first.
byte dimersDes[8];
byte dimersRea[8];
// values to write into diferent channels
//byte ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8;
// varibles for controlling the AC TRIAC DIMMER
byte channelSelect;
byte clock_tick; // variable for Timer3
byte intensity = 60;
byte increment = 1;
// calibrate with bulbs
// min no less than 5 (maximum brightness)
byte bulbMin = 20;
// max no more than 90 (minimum brightness)
byte bulbMax = 95;
byte bulbOff = 95;
// dimer time
unsigned long lastDimStep = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(57600);

  // mark the initial sensor reading time
  lastSensorReading = millis();

  // initializes relay pins as outputs
  for (int i = RELAY_CH1; i <= RELAY_CH8; i++)
    pinMode(i, OUTPUT);
  // mark the initial relay step time
  lastRelayOn = millis();

  // initializes dimer pins as outputs
  for (int i = DIMER_CH1; i <= DIMER_CH8; i++)
    pinMode(i, OUTPUT);
  // interrupt 0 is pin 2 on the Arduino Mega
  attachInterrupt(0, zero_crosss_int, RISING);
  // set a timer of length 100 microseconds for 50Hz or
  // 83 microseconds for 60Hz
  Timer3.initialize(83);
  // attach the service routine here
  Timer3.attachInterrupt(timerIsr);
  // mark the initial dimer step time
  lastDimStep = millis();

}

void loop() {
  // SERIAL RECIEVE //
  // check for messages in the serial port
  while (Serial.available() && !received) {
    char inChar = (char)Serial.read();
    if (inChar == '~') received = true;
    else inputString += inChar;
  }

  // take care of received messages
  if (received) {
    //Serial.print("---------------------");
    //Serial.println(inputString);
    // Message arrives in the form R1< :
    // R can be R for Relay or D for Dimer
    // 1 is the channel number (1-8 on both cases)
    // < is the value encoded in its char representation
    //   (in this case < = 60) asciitable.com
    if (inputString[0] == 'R') {
      for (byte i = 0; i < 8; i++) {
        // to convert from char to decimal
        byte relayNumber = inputString[1] - '0';
        if (relayNumber == i + 1) relays[i] = inputString[2];
        Serial.print(relays[i]);
        Serial.print(" ");
      }
      Serial.println();
    } else if (inputString[0] == 'D') {
      for (byte i = 0; i < 8; i++) {
        // from char to decimal
        byte dimmerNumber = inputString[1] - '0';

        if (dimmerNumber == i + 1) {
          // inputString[2] should be a value between 0 and 100.
          // Recieves the incoming value between 0 and 100 and
          // transforms it into a value between 95 and 20. Those
          // are the real values accepted by the bulbs.
          int dimmerValue = map(inputString[2], 0, 100, bulbMin, bulbMax);
          dimmerValue = constrain(dimmerValue, bulbMin, bulbMax);
          dimmerValue = bulbMax - dimmerValue + bulbMin;
          dimersDes[i] = dimmerValue;
        }
        Serial.print(dimersDes[i]);
        Serial.print(" ");
      }
      Serial.println();
    }
    inputString = "";
    received = false;
  }

  // SENSORS //
  // make a reading every 20ms
  if ((millis() - lastSensorReading) >= 20) {
    sensSoundGlob = analogRead(SENS_SOUND_GLOB);
    sensPhotoDown = analogRead(SENS_PHOTO_DOWN);
    sensPhotoUp = analogRead(SENS_PHOTO_UP);

    sensSoundInte = digitalRead(SENS_SOUND_INTE);
    sensPir = digitalRead(SENS_PIR);


    Serial.print(sensSoundGlob, DEC); // Sound Global
    Serial.print(",");
    Serial.print(sensSoundInte, DEC); // Sound Intense
    Serial.print(",");
    Serial.println(sensPir, DEC); // PIR

    // Serial.print(sensPhotoDown, DEC); // Photocell
    // Serial.print(",");
    // Serial.print(sensPhotoUp, DEC); // Photocell


    lastSensorReading = millis();
  }

  // RELAYS (SmartTint) //
  // Swing between realys every 200ms
  if ((millis() - lastRelayOn) >= 200) {
    /*
      turn_all_off(RELAY_CH1, RELAY_CH8); // turns all lights off
      digitalWrite(which, HIGH);   // sets on the current light on
      //which = which + 1;           // increment the variable to turn on the next one next time
      if (which > RELAY_CH8)       // check for the range, if greater then 15 goes back to 8
      which = RELAY_CH1;
    */

    for (int i = 0; i < 8; i++) {
      if (relays[i] == 0) digitalWrite(RELAY_CH1 + i, LOW);
      else digitalWrite(RELAY_CH1 + i, HIGH);
    }

    lastRelayOn = millis();
  }

  // DIMERS (Bulbs) //
  if (millis() - lastDimStep >= 20) {
    /*
      intensity += increment;
      if (intensity >= bulbMax || intensity <= bulbMin)
      increment = -increment;

      intensity = constrain(intensity, bulbMin, bulbMax);
      //ch1 = ch2 = ch3 = ch4 = ch5 = ch6 = ch7 = ch8 = intensity;
      //for (byte i = 0; i < 8; i++) dimersRea[i] = 5;
    */

    for (byte i = 0; i < 8; i++) {
      float dif = dimersDes[i] - dimersRea[i];
      if (dif > 1.0) dimersRea[i] += 2;
      else if (dif < -1.0) dimersRea[i] -= 2;
    }

    lastDimStep = millis();
  }

}

// function to turn off all the lights
void turn_all_off(int _first, int _last) {
  for (int i = _first; i <= _last; i++)
    digitalWrite(i, LOW);
}

void timerIsr() {
  clock_tick++;

  for (byte i = 0; i < 8; i++) {
    if (dimersRea[i] == clock_tick) {
      // triac firing
      digitalWrite(DIMER_CH1 + i, HIGH);
      // triac On propagation delay (for 60Hz use 8.33)
      delayMicroseconds(8.33);
      // triac Off
      digitalWrite(DIMER_CH1 + i, LOW);
    }
  }

  /*
    if (ch1 == clock_tick) {
    // triac firing
    digitalWrite(DIMER_CH1, HIGH);
    // triac On propogation delay (for 60Hz use 8.33)
    delayMicroseconds(8.33);
    // triac Off
    digitalWrite(DIMER_CH1, LOW);
    }

    if (ch2 == clock_tick) {
    digitalWrite(DIMER_CH2, HIGH);
    delayMicroseconds(8.33);
    digitalWrite(DIMER_CH2, LOW);
    }

    if (ch3 == clock_tick) {
    digitalWrite(DIMER_CH3, HIGH);
    delayMicroseconds(8.33);
    digitalWrite(DIMER_CH3, LOW);
    }

    if (ch4 == clock_tick) {
    digitalWrite(DIMER_CH4, HIGH);
    delayMicroseconds(8.33);
    digitalWrite(DIMER_CH4, LOW);
    }

    if (ch5 == clock_tick) {
    digitalWrite(DIMER_CH5, HIGH);
    delayMicroseconds(8.33);
    digitalWrite(DIMER_CH5, LOW);
    }

    if (ch6 == clock_tick) {
    digitalWrite(DIMER_CH6, HIGH);
    delayMicroseconds(8.33);
    digitalWrite(DIMER_CH6, LOW);
    }

    if (ch7 == clock_tick) {
    digitalWrite(DIMER_CH7, HIGH);
    delayMicroseconds(8.33);
    digitalWrite(DIMER_CH7, LOW);
    }

    if (ch8 == clock_tick) {
    digitalWrite(DIMER_CH8, HIGH);
    delayMicroseconds(8.33);
    digitalWrite(DIMER_CH8, LOW);
    }
  */
}

void zero_crosss_int() // function to be fired at the zero crossing to dim the light
{
  // Every zerocrossing interrupt:
  // For 50Hz (1/2 Cycle) => 10ms
  // For 60Hz (1/2 Cycle) => 8.33ms
  // 10ms=10000us , 8.33ms=8330us

  clock_tick = 0;
}
