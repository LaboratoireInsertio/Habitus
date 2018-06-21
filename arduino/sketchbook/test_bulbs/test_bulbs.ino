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


#include <TimerThree.h>

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

unsigned long interval=10;  // the time we need to wait
unsigned long previousMillis=0;

unsigned int  CH1, CH2, CH3, CH4, CH5, CH6, CH7, CH8;
unsigned int  buf_CH1, buf_CH2, buf_CH3, buf_CH4,buf_CH5, buf_CH6, buf_CH7, buf_CH8;
unsigned char clock_cn;    
unsigned int  clock_tick;   
int i = 255;
bool down = true;
#define freqDelay 8.33

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
  
 return ((level*(FREQ))/256)*8.33;  
}



void setup() {
  Serial.begin(57600);
  pinMode(channel_1, OUTPUT);
  pinMode(channel_2, OUTPUT);
  pinMode(channel_3, OUTPUT);
  pinMode(channel_4, OUTPUT);
  pinMode(channel_5, OUTPUT);
  pinMode(channel_6, OUTPUT);
  pinMode(channel_7, OUTPUT);
  pinMode(channel_8, OUTPUT);
  attachInterrupt(0, zero_crosss_int, RISING);
  Timer3.initialize(8.33); 
  Timer3.attachInterrupt( timerIsr );
    
}

void loop() {
 
if ((unsigned long)(millis() - previousMillis) >= interval) {
 previousMillis = millis();
  if(i >= 1 && down == true){
   i = i - 5;
   if(i <= 0)
    down = false;
  }
  if(i<255 && down == false){
   i = i + 5;
   if(i >= 255)
    down = true;
  }
  Serial.println(i);
  
  buf_CH1=buf_CH2=buf_CH3=buf_CH4=buf_CH5=buf_CH6=buf_CH7=buf_CH8=DIMM_VALUE(i);
  
  // for (i=255;i>1;i--){
  //   buf_CH1=buf_CH2=buf_CH3=buf_CH4=buf_CH5=buf_CH6=buf_CH7=buf_CH8=DIMM_VALUE(i); 

  // }
  
  // for (i=0;i<255;i++){
  //   buf_CH1=buf_CH2=buf_CH3=buf_CH4=buf_CH5=buf_CH6=buf_CH7=buf_CH8=DIMM_VALUE(i); 

  // }

 }
}