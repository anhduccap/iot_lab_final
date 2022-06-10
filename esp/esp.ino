#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>;
#include <Wire.h>
#include <BH1750.h>

//Constants
#define DHTPIN D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

#define LED1 D5
#define LED2 D6

//Sensor variable
float hum;
float temp;

//Wifi
const char* ssid = "UiTiOt-E3.1";
const char* password = "UiTiOtAP";

// MQTT broker
const char* broker = "uitiot-project.cloud.shiftr.io";
const int port = 1883;
const char* mqttUser = "uitiot-project";
const char* mqttPassword = "IxsgePPpgwQASeeX";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.println();
  Serial.println("-----------------------");
  Serial.print("Message received in topic: ");
  String topic_str;
  char topic_arr[100] = "";
  strncpy(topic_arr, topic, 100);
  for (int i = 0; i < (sizeof(topic_arr) / sizeof(topic_arr[0])); i++) {
    topic_str += topic_arr[i];
  }
  Serial.print(topic_str);
  Serial.print("   length is:");
  Serial.println(length);

  Serial.print("Data Received From Broker: ");
  String message;
  for (int i = 0; i < length; i++) {
    message = message + (char) payload[i];
  }
  Serial.print(message);
  Serial.println();

  //Handle turn on/off led request
  if (topic_str == "sensor/led1") {
    if (message == "1") {
      digitalWrite(LED1, HIGH);
    } else {
      digitalWrite(LED1, LOW);
    }
  }
  else if (topic_str == "sensor/led2") {
    if (message == "1") {
      digitalWrite(LED2, HIGH);
    } else {
      digitalWrite(LED2, LOW);
    }
  }
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi ...");
  }
  Serial.println("Connected to the WiFi network");

  Wire.begin();
  dht.begin();
  lightMeter.begin();

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  digitalWrite(LED1, LOW);
  digitalWrite(LED2, LOW);

  client.setServer(broker, port);
  client.setCallback(callback);

  while (!client.connected()) {
    Serial.println("Connecting to mqtt broker.....");
    if (client.connect("ESP8266_Client", mqttUser, mqttPassword)) {
      Serial.println("Mqtt broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.println(client.state());
      delay(2000);
    }
  }

  client.publish("test_topic", "Hello mqtt from esp8266");
  client.subscribe("sensor/led1");
  client.subscribe("sensor/led2");
}

void loop() {
  client.loop();

  //Read data and store it to variables hum and temp
  hum = dht.readHumidity();
  temp = dht.readTemperature();
  //Print temp and humidity values to serial monitor
  Serial.print("Humidity: ");
  Serial.print(hum);
  Serial.print(" %, Temp: ");
  Serial.print(temp);
  Serial.println(" Celsius");

  float lux = lightMeter.readLightLevel();
  Serial.print("Light: ");
  Serial.print(lux);
  Serial.println(" lx");

  char data_temp[10];
  char data_hum[10];
  char data_lux[10];

  sprintf(data_temp, "%f", temp);
  sprintf(data_hum, "%f", hum);
  sprintf(data_lux, "%f", lux);
  
  client.publish("sensor/temp", data_temp);
  client.publish("sensor/hum", data_hum);
  client.publish("sensor/lux", data_lux);

  delay(5000);
}
