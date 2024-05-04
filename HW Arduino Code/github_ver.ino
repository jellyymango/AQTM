#include <Wire.h>
#include <SPI.h>
#include <Arduino.h>
#include <Adafruit_BMP280.h>
#include <SensirionI2CSgp41.h>
#include "Adafruit_SHT4x.h"
#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include <Firebase_ESP_Client.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <NOxGasIndexAlgorithm.h>
#include <SensirionI2CSgp41.h>
#include <SensirionI2cSht4x.h>
#include <VOCGasIndexAlgorithm.h>

#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);

// set up SHT4x stuff 
Adafruit_SHT4x sht4 = Adafruit_SHT4x();

SensirionI2cSht4x sht4x;
SensirionI2CSgp41 sgp41;

VOCGasIndexAlgorithm voc_algorithm;
NOxGasIndexAlgorithm nox_algorithm;


//needed for formadhyde sensor 
uint16_t conditioning_s = 10;
int incomingByte = 0; 
int a[9] = {0};
int c = 0;


#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

// Insert Firebase project API Key
#define API_KEY ""

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "" 

// sum newroking stuff + webserver for back up 

AsyncWebServer server(80);

//Define Firebase Data object
FirebaseData fbdo_aqt; 

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;


int timestamp;
String databasePath;
String timePath = "/timestamp";
String tempPath = "/temperature";
String humPath = "/humidity";
String presPath = "/pressure";
String VOCPath = "/VOC";
String NOXPath = "/NOX";
String formPath = "/Formaldehyde";
String altPath = "/Altitude";

String parentPath;

FirebaseJson json;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
// bmp 
Adafruit_BMP280 bmp; // I2C

sensors_event_t humidity, temp;



////function needed for web server might or might no use 
//String readSHTTemperature() {
//  sht4.getEvent(&humidity, &temp);
//  float t = temp.temperature;
//  if (isnan(t)) {    
//    Serial.println("Failed to read from SHT sensor!");
//    return "--";
//  }
//  else {
//    Serial.println(t);
//    return String(t);
//  }
//}
//
//String readSHTHumidity() {
//  sht4.getEvent(&humidity, &temp);
//  float h = humidity.relative_humidity;
//  if (isnan(h)) {
//    Serial.println("Failed to read from SHT sensor!");
//    return "--";
//  }
//  else {
//    Serial.println(h);
//    return String(h);
//  }
//}

unsigned long getTime() {
  timeClient.update();
  unsigned long now = timeClient.getEpochTime();
  return now;
}

// html code not in use backup 

//const char index_html[] PROGMEM = R"rawliteral(
//<!DOCTYPE HTML><html>
//<head>
//  <meta name="viewport" content="width=device-width, initial-scale=1">
//  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
//  <style>
//    html {
//     font-family: Arial;
//     display: inline-block;
//     margin: 0px auto;
//     text-align: center;
//    }
//    h2 { font-size: 3.0rem; }
//    p { font-size: 3.0rem; }
//    .units { font-size: 1.2rem; }
//    .SHT-labels{
//      font-size: 1.5rem;
//      vertical-align:middle;
//      padding-bottom: 15px;
//    }
//  </style>
//</head>
//<body>
//  <h2>ESP32 Server</h2>
//  <p>
//    <span class="SHT-labels">Temperature:</span> 
//    <span id="temperature">%TEMPERATURE%</span>
//    <sup class="units">&deg;C</sup>
//  </p>
//  <p>
//
//    <span class="SHT-labels">Humidity:</span>
//    <span id="humidity">%HUMIDITY%</span>
//    <sup class="units">&percnt;</sup>
//  </p>
//</body>
//<script>
//setInterval(function ( ) {
//  var xhttp = new XMLHttpRequest();
//  xhttp.onreadystatechange = function() {
//    if (this.readyState == 4 && this.status == 200) {
//      document.getElementById("temperature").innerHTML = this.responseText;
//    }
//  };
//  xhttp.open("GET", "/temperature", true);
//  xhttp.send();
//}, 1000 ) ;
//
//setInterval(function ( ) {
//  var xhttp = new XMLHttpRequest();
//  xhttp.onreadystatechange = function() {
//    if (this.readyState == 4 && this.status == 200) {
//      document.getElementById("humidity").innerHTML = this.responseText;
//    }
//  };
//  xhttp.open("GET", "/humidity", true);
//  xhttp.send();
//}, 1000 ) ;
//</script>
//</html>)rawliteral";
//
//// Replaces placeholder with SHT values
//String processor(const String& var){
//  //Serial.println(var);
//  if(var == "TEMPERATURE"){
//    return readSHTTemperature();
//  }
//  else if(var == "HUMIDITY"){
//    return readSHTHumidity();
//  }
//  return String();
//}


// algorrith setup 




void setup(){
    Serial.begin(9600);
  while ( !Serial ) delay(100);   // wait for native usb
  Serial.println("START");
  unsigned status;
  status = bmp.begin(0x76);
  if (!status) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                      "try a different address!"));
    Serial.print("SensorID was: 0x"); Serial.println(bmp.sensorID(),16);
    while (1) delay(10);
  }
  // sht45 init 
  if (! sht4.begin()) {
    Serial.println("Couldn't find SHT4x");
    while (1) delay(1);
  }
  /* Default settings from datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
  sht4.setPrecision(SHT4X_HIGH_PRECISION);
  switch (sht4.getPrecision()) {
     case SHT4X_HIGH_PRECISION: 
       Serial.println("High precision");
       break;
     case SHT4X_MED_PRECISION: 
       Serial.println("Med precision");
       break;
     case SHT4X_LOW_PRECISION: 
       Serial.println("Low precision");
       break;
  }

  // You can have 6 different heater settings
  // higher heat and longer times uses more power
  // and reads will take longer too!
  sht4.setHeater(SHT4X_NO_HEATER);
  switch (sht4.getHeater()) {
     case SHT4X_NO_HEATER: 
       Serial.println("No heater");
       break;
     case SHT4X_HIGH_HEATER_1S: 
       Serial.println("High heat for 1 second");
       break;
     case SHT4X_HIGH_HEATER_100MS: 
       Serial.println("High heat for 0.1 second");
       break;
     case SHT4X_MED_HEATER_1S: 
       Serial.println("Medium heat for 1 second");
       break;
     case SHT4X_MED_HEATER_100MS: 
       Serial.println("Medium heat for 0.1 second");
       break;
     case SHT4X_LOW_HEATER_1S: 
       Serial.println("Low heat for 1 second");
       break;
     case SHT4X_LOW_HEATER_100MS: 
       Serial.println("Low heat for 0.1 second");
       break;
  }


    Wire.begin();

    uint16_t error;
    char errorMessage[256];

    sgp41.begin(Wire);
    sht4x.begin(Wire, SHT40_I2C_ADDR_44);

    uint8_t serialNumberSize = 3;
    uint16_t serialNumber[serialNumberSize];

    error = sgp41.getSerialNumber(serialNumber);

    if (error) {
        Serial.print("Error trying to execute getSerialNumber(): ");
        errorToString(error, errorMessage, 256);
        Serial.println(errorMessage);
    } else {
        Serial.print("SerialNumber:");
        Serial.print("0x");
        for (size_t i = 0; i < serialNumberSize; i++) {
            uint16_t value = serialNumber[i];
            Serial.print(value < 4096 ? "0" : "");
            Serial.print(value < 256 ? "0" : "");
            Serial.print(value < 16 ? "0" : "");
            Serial.print(value, HEX);
        }
        Serial.println();
    }

    uint16_t testResult;
    error = sgp41.executeSelfTest(testResult);
    if (error) {
        Serial.print("Error trying to execute executeSelfTest(): ");
        errorToString(error, errorMessage, 256);
        Serial.println(errorMessage);
    } else if (testResult != 0xD400) {
        Serial.print("executeSelfTest failed with error: ");
        Serial.println(testResult);
    }




    // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  
  // Print ESP32 Local IP Address
  Serial.println(WiFi.localIP());
  
  // Route for root / web page not in use 
//  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
//    request->send_P(200, "text/html", index_html, processor);
//  });
//  server.on("/temperature", HTTP_GET, [](AsyncWebServerRequest *request){
//    request->send_P(200, "text/plain", readSHTTemperature().c_str());
//  });
//  server.on("/humidity", HTTP_GET, [](AsyncWebServerRequest *request){
//    request->send_P(200, "text/plain", readSHTHumidity().c_str());
//  });
  
  // Start server
  server.begin();  

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  databasePath = "/testing/";



  //oled setup 

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }

  display.display();
  delay(2000);  // Delay for 2 seconds
  display.clearDisplay();


  delay(1000);

  int32_t index_offset;
  int32_t learning_time_offset_hours;
  int32_t learning_time_gain_hours;
  int32_t gating_max_duration_minutes;
  int32_t std_initial;
  int32_t gain_factor;
  voc_algorithm.get_tuning_parameters(
      index_offset, learning_time_offset_hours, learning_time_gain_hours,
      gating_max_duration_minutes, std_initial, gain_factor);

  Serial.println("\nVOC Gas Index Algorithm parameters");
  Serial.print("Index offset:\t");
  Serial.println(index_offset);
  Serial.print("Learning time offset hours:\t");
  Serial.println(learning_time_offset_hours);
  Serial.print("Learning time gain hours:\t");
  Serial.println(learning_time_gain_hours);
  Serial.print("Gating max duration minutes:\t");
  Serial.println(gating_max_duration_minutes);
  Serial.print("Std inital:\t");
  Serial.println(std_initial);
  Serial.print("Gain factor:\t");
  Serial.println(gain_factor);

  nox_algorithm.get_tuning_parameters(
      index_offset, learning_time_offset_hours, learning_time_gain_hours,
      gating_max_duration_minutes, std_initial, gain_factor);

  Serial.println("\nNOx Gas Index Algorithm parameters");
  Serial.print("Index offset:\t");
  Serial.println(index_offset);
  Serial.print("Learning time offset hours:\t");
  Serial.println(learning_time_offset_hours);
  Serial.print("Gating max duration minutes:\t");
  Serial.println(gating_max_duration_minutes);
  Serial.print("Gain factor:\t");
  Serial.println(gain_factor);
  Serial.println("");
  
}

static uint16_t entry_index = 0;

void LED_LoopNext(){
    display.display(); // Update the display
    delay(3000); // 
    display.clearDisplay(); // Clear the display buffer
    display.setTextSize(2);      // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE); // Draw white text
    display.setCursor(0,0);     // Start at top-left corner
}

const int buttonPin = 4;

void loop() {
  uint16_t error;
  char errorMessage[256];
  uint16_t defaultRh = 0x8000;
  uint16_t defaultT = 0x6666;
  uint16_t srawVoc = 0;
  uint16_t srawNox = 0;
  float formaldehyde_int = 0;
  uint16_t entry_index = 0;
  float humidity1 = 0;     // %RH
  float temperature1 = 0;  // degreeC
  uint16_t defaultCompenstaionRh = 0x8000;  // in ticks as defined by SGP41
  uint16_t defaultCompenstaionT = 0x6666;   // in ticks as defined by SGP41
  uint16_t compensationRh = 0;              // in ticks as defined by SGP41
  uint16_t compensationT = 0;               // in ticks as defined by SGP41
  int32_t voc_index = 0;
  int32_t nox_index = 0;
  
  delay(10);

  if (Serial.available() > 0) {
    for (int i = 0; i < 9; i++) {
      incomingByte = Serial.read();
      delay(20);
      a[i] = incomingByte; 
    } 
    c = a[4] * 256 + a[5];
    formaldehyde_int = c;
    if (formaldehyde_int > 1000){
    formaldehyde_int = formaldehyde_int/10000;
    } else {
    formaldehyde_int = formaldehyde_int/1000;
    }  
    Serial.print("ZE08 Formaldehyde: ");  
    Serial.println(c);        
  }

  sensors_event_t humidity, temp;
  sht4.getEvent(&humidity, &temp); // populate temp and humidity objects with fresh data
  Serial.print("SHT45 Temperature: "); Serial.print(temp.temperature); Serial.println(" degrees C");
  Serial.print("SHT45 Humidity: "); Serial.print(humidity.relative_humidity); Serial.println("% rH");
  
  Serial.print(F("BMP280 Temperature = "));
  Serial.print(bmp.readTemperature());
  Serial.println(" *C");
  
  Serial.print(F("BMP280 Pressure = "));
  Serial.print(bmp.readPressure());
  Serial.println(" Pa");

  Serial.print(F("BMP280 Approx altitude = "));
  Serial.print(bmp.readAltitude(1013.25)); /* Adjusted to local forecast! */
  Serial.println(" m");
  entry_index = entry_index + 1; // Increment entry_index after uploading data

  if (conditioning_s > 0) {
    // During NOx conditioning (10s) SRAW NOx will remain 0
    error = sgp41.executeConditioning(defaultRh, defaultT, srawVoc);
    conditioning_s--;
  } else {
    // Read Measurement
    error = sgp41.measureRawSignals(defaultRh, defaultT, srawVoc, srawNox);
  }

  if (error) {
    Serial.print("Error trying to execute measureRawSignals(): ");
    errorToString(error, errorMessage, 256);
    Serial.println(errorMessage);
  } else {
    Serial.print("SRAW_VOC: ");
    Serial.print(srawVoc);
    Serial.print("\t");
    Serial.print("SRAW_NOx: ");
    Serial.println(srawNox);
  }
  Serial.println("////////////////////////////////////");










  // 2. Measure temperature and humidity for SGP internal compensation
    error = sht4x.measureHighPrecision(temperature1, humidity1);
    if (error) {
        Serial.print(
            "SHT4x - Error trying to execute measureHighPrecision(): ");
        errorToString(error, errorMessage, 256);
        Serial.println(errorMessage);
        Serial.println("Fallback to use default values for humidity and "
                       "temperature compensation for SGP41");
        compensationRh = defaultCompenstaionRh;
        compensationT = defaultCompenstaionT;
    } else {
        Serial.print("T:");
        Serial.print(temperature1);
        Serial.print("\t");
        Serial.print("RH:");
        Serial.println(humidity1);

        // convert temperature and humidity to ticks as defined by SGP41
        // interface
        // NOTE: in case you read RH and T raw signals check out the
        // ticks specification in the datasheet, as they can be different for
        // different sensors
        compensationT = static_cast<uint16_t>((temperature1 + 45) * 65535 / 175);
        compensationRh = static_cast<uint16_t>(humidity1 * 65535 / 100);
    }

    // 3. Measure SGP4x signals
    if (conditioning_s > 0) {
        // During NOx conditioning (10s) SRAW NOx will remain 0
        error =
            sgp41.executeConditioning(compensationRh, compensationT, srawVoc);
        conditioning_s--;
    } else {
        error = sgp41.measureRawSignals(compensationRh, compensationT, srawVoc,
                                        srawNox);
    }

    // 4. Process raw signals by Gas Index Algorithm to get the VOC and NOx
    // index
    //    values
    if (error) {
        Serial.print("SGP41 - Error trying to execute measureRawSignals(): ");
        errorToString(error, errorMessage, 256);
        Serial.println(errorMessage);
    } else {
        voc_index = voc_algorithm.process(srawVoc);
        nox_index = nox_algorithm.process(srawNox);
//        Serial.print("VOC raw: ");
//        Serial.print(srawVoc);
//        Serial.print("NOx raw: ");
//        Serial.println(srawNox);
        Serial.print("VOC Index: ");
        Serial.print(voc_index);
        Serial.print("\t");
        Serial.print("NOx Index: ");
        Serial.println(nox_index);
    }








  timestamp = getTime();
  parentPath = databasePath + String(timestamp);
  json.set(timePath, String(timestamp));
  json.set(tempPath.c_str(), String(temp.temperature));
  json.set(humPath.c_str(), String(humidity.relative_humidity));
  json.set(presPath.c_str(), String(bmp.readPressure()));
  json.set(VOCPath.c_str(), String(voc_index));
  json.set(NOXPath.c_str(), String(nox_index));
  json.set(formPath.c_str(), String(formaldehyde_int));
  json.set(altPath.c_str(), String(bmp.readAltitude(1013.25))); 
  Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo_aqt, parentPath.c_str(), &json) ? "ok" : fbdo_aqt.errorReason().c_str());


  float temp_1 = temp.temperature;
  float hum_1 = humidity.relative_humidity;
  float pres_1 = bmp.readPressure();
  float VOC_1 = voc_index;
  float NOX_1 = nox_index;
  float form_1 = formaldehyde_int; 
  float alt_1 = bmp.readAltitude(1013.25); 





  
     
    display.clearDisplay();
    
    display.setTextSize(2);      // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE); // Draw white text
    display.setCursor(0,0);     // Start at top-left corner
  
    char temp_str[10];
    char hum_str[10];
    char pres_str[10];
    char VOC_str[10];
    char NOX_str[10];
    char form_str[10];
    char alt_str[10];
  
    dtostrf(temp_1, 6, 1, temp_str);
    dtostrf(hum_1, 6, 1, hum_str);
    dtostrf(pres_1, 6, 1, pres_str);
    dtostrf(VOC_1, 6, 1, VOC_str);
    dtostrf(NOX_1, 6, 1, NOX_str);
    dtostrf(form_1, 6, 3, form_str);
    dtostrf(alt_1, 6, 1, alt_str);

    
    display.print("Temp: \n");
    display.println(String(temp_str) + "C");
    LED_LoopNext();
    display.print("Humidity: ");
    display.println(String(hum_str)+"%");
    
    LED_LoopNext();
    display.print("Pressure: ");
    display.println(String(pres_str)+"Pa");
    
    LED_LoopNext();
    display.print("VOC Index: ");
    display.println(VOC_str);
    LED_LoopNext();
    display.print("NOx Index: ");
    display.println(NOX_str);
    LED_LoopNext();
    display.print("CH2O: \n");
    display.println(String(form_str)+"ppm");
    LED_LoopNext();
    display.print("Altitude: ");
    display.println(String(alt_str)+"m");
    
    display.display();
      
  delay(3000);
 
}
