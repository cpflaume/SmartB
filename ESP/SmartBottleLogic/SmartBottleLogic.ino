#include <ESP8266WiFi.h>
#include <Wire.h>
#include <PubSubClient.h>
#include "RunningMedian.h"

#define wifi_ssid "xxx"
#define wifi_password "xxx"

#define mqtt_server "xxx.xxx.xxx.xxx"
#define clientName "SmartBottle1"


int readIntervall = 30;
int refreshRate = 5000 ;
int lowerBound = 670;
int upperBound = 820;
int fillValue = 0;

WiFiClient espClient;
PubSubClient client(espClient);
RunningMedian median = RunningMedian(readIntervall);

void setup() {
  pinMode(16, OUTPUT);
  Serial.begin(9600);
  setup_wifi();
  
  client.setServer(mqtt_server, 1883);

}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  fillValue = getFillStatus(readIntervall);
  
  client.publish("SmartBottle", String(fillValue).c_str(), true);
}

long getFillStatus(long durationInS)
{
  long rawValue = 0;
   median.clear();
for (int i = 0; i< durationInS;i++)
  {
     client.loop();
     rawValue = readSensor();
      
     median.add(rawValue);
     delay(1000);
  }
  
  Serial.println("Send " + String(median.getMedian()));
  return median.getMedian();
}   

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);

  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) { 
    ledWaitFast(3);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    ledWaitFast(5);
    // Attempt to connect
    // If you do not want to use a username and password, change next line to
    // if (client.connect("ESP8266Client")) {
    if (client.connect(clientName)) {
      Serial.println("connected");
      led(true);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      ledWaitSlow(3);
      
    }
  }
}

long readSensor(void) {
  int fsrReading = 0;
  fsrReading = analogRead(0);
  if (fsrReading < lowerBound)
  fsrReading = lowerBound;
  if (fsrReading > upperBound)
  fsrReading = upperBound;
    
  Serial.print("Analog reading = ");
  Serial.println(fsrReading);
  
  return map(fsrReading,lowerBound,upperBound,0,100);
}

void ledWaitSlow(long ms){

 for(int i =0;i<ms;i++)
 {
  digitalWrite(16,HIGH);
  delay(500);
  digitalWrite(16,LOW);
  delay(500);
 }
}

void ledWaitFast(long ms){

 for(int i =0;i<ms*2;i++)
 {
  digitalWrite(16,HIGH);
  delay(250);
  digitalWrite(16,LOW);
  delay(250);
 }
}


void led(boolean switchMe){
  if (switchMe){
  digitalWrite(16,HIGH);
  }
  else{
    digitalWrite(16,LOW);
    }
  }




