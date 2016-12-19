int sensorValue1, sensorValue2, sensorValue3, sensorValue4;

int an01, an02, an03, di01, di02;

void setup() {
  Serial.begin(9600);
}

void loop() {
  
  an01 = analogRead(0);
  an02 = analogRead(2);
  an03 = analogRead(3);
  di01 = digitalRead(2);
  di02 = digitalRead(3);
  
  Serial.print(an01, DEC); // Sound Global
  Serial.print(",");
  Serial.print(di01, DEC); // Sound Intense
  Serial.print(",");
  Serial.print(an02, DEC); // Photocell
  Serial.print(",");
  Serial.print(an03, DEC); // Photocell
  Serial.print(",");
  Serial.println(di02, DEC); // PIR

  // wait 20ms for next reading
  delay(20);
}
