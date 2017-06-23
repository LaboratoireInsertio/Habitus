
void setup() {
  Serial.begin(9600);
  pinMode(A0, INPUT_PULLUP);
  pinMode(A1, INPUT_PULLUP);

}

void loop() {
  Serial.print("0 : ");
  Serial.print(digitalRead(A0));
  Serial.print(" 1: ");
  Serial.println(digitalRead(A1));
  

}
