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


#include <TimerOne.h>

#define channel_1 24
#define channel_2 25
#define channel_3 26
#define channel_4 27
#define channel_5 28
#define channel_6 29
#define channel_7 30
#define channel_8 31

#define SPEED 2

#define GATE_IMPULSE 5

#define FREQ 84

unsigned int  CH1, CH2, CH3, CH4, CH5, CH6, CH7, CH8;
unsigned int  buf_CH1, buf_CH2, buf_CH3, buf_CH4, buf_CH5, buf_CH6, buf_CH7, buf_CH8;
unsigned char clock_cn;
unsigned int  clock_tick;
unsigned char i;

void setup() {

  pinMode(channel_1, OUTPUT);
  pinMode(channel_2, OUTPUT);
  pinMode(channel_3, OUTPUT);
  pinMode(channel_4, OUTPUT);
  pinMode(channel_5, OUTPUT);
  pinMode(channel_6, OUTPUT);
  pinMode(channel_7, OUTPUT);
  pinMode(channel_8, OUTPUT);
  attachInterrupt(1, zero_crosss_int, RISING);
  Timer1.initialize(10);
  Timer1.attachInterrupt( timerIsr );

}

void timerIsr()
{
    clock_tick++;

    if (clock_cn)
     {
      clock_cn++;

       if (clock_cn==GATE_IMPULSE)
       {
        digitalWrite(channel_1, LOW);
        digitalWrite(channel_2, LOW);
        digitalWrite(channel_3, LOW);
        digitalWrite(channel_4, LOW);
        digitalWrite(channel_5, LOW);
        digitalWrite(channel_6, LOW);
        digitalWrite(channel_7, LOW);
        digitalWrite(channel_8, LOW);
        clock_cn=0;
       }
     }

        if (CH1==clock_tick)
         {
          digitalWrite(channel_1, HIGH);
          clock_cn=1;
         }

           if (CH2==clock_tick)
            {
             digitalWrite(channel_2, HIGH);
             clock_cn=1;
            }

              if (CH3==clock_tick)
               {
                digitalWrite(channel_3, HIGH);
                clock_cn=1;
               }

                 if (CH4==clock_tick)
                  {
                   digitalWrite(channel_4, HIGH);
                   clock_cn=1;
                  }

                  if (CH5==clock_tick)
                   {
                    digitalWrite(channel_5, HIGH);
                    clock_cn=1;
                   }
                     if (CH6==clock_tick)
                      {
                       digitalWrite(channel_6, HIGH);
                       clock_cn=1;
                      }
                      if (CH7==clock_tick)
                       {
                        digitalWrite(channel_7, HIGH);
                        clock_cn=1;
                       }
                       if (CH8==clock_tick)
                        {
                         digitalWrite(channel_8, HIGH);
                         clock_cn=1;
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
       // CH7=buf_CH7;
        // CH8=buf_CH8;

  clock_tick=0;
}

unsigned int DIMM_VALUE (unsigned char level)
{
 unsigned int buf_level;

 if (level < 26)  {level=26;}
 if (level > 229) {level=229;}

 return ((level*(FREQ))/256)*10;
}



void loop() {

  for (i=255;i>1;i--) {buf_CH1=DIMM_VALUE(i); delay(SPEED);}
   for (i=255;i>1;i--) {buf_CH2=DIMM_VALUE(i); delay(SPEED);}
    for (i=255;i>1;i--) {buf_CH3=DIMM_VALUE(i); delay(SPEED);}
     for (i=255;i>1;i--) {buf_CH4=DIMM_VALUE(i); delay(SPEED);}
      for (i=255;i>1;i--) {buf_CH5=DIMM_VALUE(i); delay(SPEED);}
       for (i=255;i>1;i--) {buf_CH6=DIMM_VALUE(i); delay(SPEED);}

  for (i=0;i<255;i++) {buf_CH1=DIMM_VALUE(i); delay(SPEED);}
   for (i=0;i<255;i++) {buf_CH2=DIMM_VALUE(i); delay(SPEED);}
    for (i=0;i<255;i++) {buf_CH3=DIMM_VALUE(i); delay(SPEED);}
     for (i=0;i<255;i++) {buf_CH4=DIMM_VALUE(i); delay(SPEED);}
      for (i=0;i<255;i++) {buf_CH5=DIMM_VALUE(i); delay(SPEED);}
       for (i=0;i<255;i++) {buf_CH6=DIMM_VALUE(i); delay(SPEED);}
}
