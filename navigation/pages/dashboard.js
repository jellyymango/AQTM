import * as React from 'react';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Dashboard({temperature, humidity, temperatureUnit }) {
  const [timeData, setTimeData] = useState(new Date());
  const formattedTime = timeData.toLocaleTimeString().replace(/:\d{2}\s/, ' ');
  const [location, setLocation] = useState(null);
  const [locationErr, setLocationErr] = useState(null);
  let tempValue = temperatureUnit === 'Fahrenheit'? (temperature * 9 / 5) + 32 : temperature;
  //console.log(temperature);
  //console.log(humidity);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeData(new Date());
    }, 30000); // update every 30 sec
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
        let city = reverseGeocode[0].city;
        let state = reverseGeocode[0].region;
        setLocation({ city, state });
      } else {
        setLocationErr('Location access denied :(');
      }
    })();
  }, []);

  return (
    <View style={styles.tempContainer}>
      <View style={styles.tempHeader}>
        <Text style={styles.tempText}>
          {temperature!== null? (
              <>{Math.round(tempValue)}˚{temperatureUnit === 'Fahrenheit'? 'F' : 'C'}</>
            ) : (
              <Text>...</Text>
            )
          }
        </Text>
      </View>

      <View style={styles.locationContainer}>
        {location? (
          <Text style={styles.locationText}>
            {location.city}, {location.state}
          </Text>
        ) : (
          <Text>{locationErr}</Text>
        )}
      </View>

      <View style = {styles.humidityContainer}>
        <Text style = {styles.humidityText}>
          Humidity: {humidity} %

        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
        {formattedTime}

        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tempContainer: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "center",
  },
  tempHeader: {
    flexDirection: "row",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
    display: "inline-block",
  },
  tempText: {
    fontSize: 96,
    color: "black",
  },
  locationContainer: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "center",
  },
  locationText: {
    fontSize: 40,
    color: "black",
    textAlign: "center",
  },
  humidityContainer: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "center",
  },
  humidityText: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
  },

  timeContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 100,
  },
  degreeSymbol:{
    fontSize: 72,
    //position: 'absolute',
    //right: -20,
    //top: -16,
  },
  timeText: {
    fontSize: 50,
    color: "black",
  },
});