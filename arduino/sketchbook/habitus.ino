/***********************************************************************************
 *
 * Demo Arduino code for 4CH AC DIMMER MODULE
 *
 * AC LINE FREQUENCY - 60HZ !
 *
 * Variables for dimming - buf_CH1, buf_CH2, buf_CH3, buf_CH4 !
 *
 * Variables have range 0-255. 0 - Fully ON, 255 - Fully OFF.
 *
 * KRIDA Electronics, 4 SEP 2016
 ***********************************************************************************/

#include <string.h>
#include <TimerThree.h>
#define SERIAL_BUFFER_SIZE 256

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


#define channel_1 24
#define channel_2 25
#define channel_3 26
#define channel_4 27
#define channel_5 28
#define channel_6 29
#define channel_7 30
#define channel_8 31

#define SPEED 1
#define GATE_IMPULSE 9
#define FREQ 84
#define freqDelay 8.33

unsigned long interval=10;  // the time we need to wait
unsigned long previousMillis=0;

byte arrayBulbs[8][2];
byte arrayTints[8][2] = {
  {34,LOW},{35,LOW},{36,LOW},{37,LOW},{38,LOW},{39,LOW},{40,LOW},{41,LOW}
};


unsigned int  CH1, CH2, CH3, CH4, CH5, CH6, CH7, CH8;
unsigned int  buf_CH1, buf_CH2, buf_CH3, buf_CH4,buf_CH5, buf_CH6, buf_CH7, buf_CH8;
unsigned char clock_cn;
unsigned int  clock_tick;
unsigned char i;
int stepBulb = 5;

// Serial declaration ---------------------//
const byte numChars = 50;
char receivedChars[numChars];
char *p;
boolean newData = false;


void timerIsr()
{
clock_tick++;

if (CH1==clock_tick)
{
digitalWrite(channel_1, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_1, LOW); // triac Off
}

if (CH2==clock_tick)
{
digitalWrite(channel_2, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_2, LOW); // triac Off
}

if (CH3==clock_tick)
{
digitalWrite(channel_3, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_3, LOW); // triac Off
}

if (CH4==clock_tick)
{
digitalWrite(channel_4, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_4, LOW); // triac Off
}

if (CH5==clock_tick)
{
digitalWrite(channel_5, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_5, LOW); // triac Off
}

if (CH6==clock_tick)
{
digitalWrite(channel_6, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_6, LOW); // triac Off
}

if (CH7==clock_tick)
{
digitalWrite(channel_7, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_7, LOW); // triac Off
}

if (CH8==clock_tick)
{
digitalWrite(channel_8, HIGH); // triac firing
delayMicroseconds(freqDelay); // triac On propogation delay (for 60Hz use 8.33)
digitalWrite(channel_8, LOW); // triac Off
}


}


void zero_crosss_int()
{
  CH1=buf_CH1;
   CH2=buf_CH2;
    CH3=buf_CH3;
     CH4=buf_CH4;
      CH5=buf_CH5;
       CH6=buf_CH6;
        CH7=buf_CH7;
         CH8=buf_CH8;


  clock_tick=0;
}

unsigned int DIMM_VALUE (unsigned char level)
{
 unsigned int buf_level;

 if (level < 26)  {level=26;}
 if (level > 247) {level=247;}

 return ((level*(FREQ))/256)*freqDelay;
}



void setup() {
    Serial.begin (1000000);

//  // initializes relay pins as outputs
//  for (int i = RELAY_CH1; i <= RELAY_CH8; i++)
//    pinMode(i, OUTPUT);

  // initializes dimer pins as outputs
  for (int i = channel_1; i <= channel_8; i++)
    pinMode(i, OUTPUT);

  attachInterrupt(0, zero_crosss_int, RISING);
  Timer3.initialize(8.33);
  Timer3.attachInterrupt( timerIsr );

  //Setup array for bulbs values
  for(i=0;i<8;i++){
    arrayBulbs[i][0] = 255;
    arrayBulbs[i][1] = 255;

     // initializes relay pins as outputs
     pinMode(arrayTints[i][0], OUTPUT);
  }



}

void sendValue(String sensor, int value){
//  Serial.print("<");
 Serial.print(sensor);
 Serial.print(":");
 Serial.println(value, DEC);
//  Serial.println(">");
}


void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;

 // if (Serial.available() > 0) {
    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void showNewData() {
  String type;
  int id;
  int value;
    if (newData == true) {
        //  Serial.println(receivedChars);
        type = strtok(receivedChars,":");


        if(type == "b"){
         for(int b=0;b<8;b++){
          arrayBulbs[b][1] = atol(strtok(NULL,":"));
          arrayBulbs[b][1] = map(arrayBulbs[b][1], 0,255,255,0);
         }
        
        }
        if(type == "t"){
          for(int b=0;b<8;b++){
            arrayTints[b][1] = atol(strtok(NULL,":"));
            digitalWrite(arrayTints[b][0], arrayTints[b][1]);

          }
        }

        newData = false;
    }
}



void loop() {
    
 
    if ((unsigned long)(millis() - previousMillis) >= 5) {
      previousMillis = millis();
        
        recvWithStartEndMarkers();
        showNewData();
        
        //Read data sensors and send
        sensSoundGlob = analogRead(SENS_SOUND_GLOB);
        if(sensSoundGlob > 5){
          sendValue("sensSoundGlobal", sensSoundGlob);
        }
    
        if(sensSoundInte != digitalRead(SENS_SOUND_INTE)){
          sensSoundInte = digitalRead(SENS_SOUND_INTE);
          if(sensSoundInte == 1) sendValue("sensSoundInte", sensSoundInte);
        }
    
        if(sensPir != digitalRead(SENS_PIR)){
          sensPir = digitalRead(SENS_PIR);
          if(sensPir == 1) sendValue("sensPir",sensPir);
        }

     
     for(i=0;i<8;i++){
     
      if(arrayBulbs[i][0] != arrayBulbs[i][1]){
        if(arrayBulbs[i][0] < arrayBulbs[i][1]){
          arrayBulbs[i][0] = arrayBulbs[i][0] + stepBulb;
          if(arrayBulbs[i][0] > 255) arrayBulbs[i][0] = 255;
         
        }else{
          arrayBulbs[i][0] = arrayBulbs[i][0] - stepBulb;
          if(arrayBulbs[i][0] < 0) arrayBulbs[i][0] = 0;
        }
        

        //@TODO: Need Simplify this code
        if(i==0){ buf_CH1=DIMM_VALUE(arrayBulbs[i][0]); }
        if(i==1){ buf_CH2=DIMM_VALUE(arrayBulbs[i][0]); }
        if(i==2){ buf_CH3=DIMM_VALUE(arrayBulbs[i][0]); }
        if(i==3){ buf_CH4=DIMM_VALUE(arrayBulbs[i][0]); }
        if(i==4){ buf_CH5=DIMM_VALUE(arrayBulbs[i][0]); }
        if(i==5){ buf_CH6=DIMM_VALUE(arrayBulbs[i][0]); }
        if(i==6){ buf_CH7=DIMM_VALUE(arrayBulbs[i][0]); }
        if(i==7){ buf_CH8=DIMM_VALUE(arrayBulbs[i][0]); }
        
//        Serial.print("Bulb : "); Serial.print(i);Serial.print(" value : ");Serial.println(arrayBulbs[i][0]);
        
        if(arrayBulbs[i][0] == arrayBulbs[i][1]){
        //   Serial.print("Bulb updated to : ");
        //   Serial.println(arrayBulbs[i][0]);
        }
      }
     }
    }
}

