import * as React from 'react';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';

export default function Dashboard({
  temperature,
  humidity,
  temperatureUnit,
  form,
  nox,
  voc,
  customFonts,
}) {
  const [timeData, setTimeData] = useState(new Date());
  const formattedTime = timeData.toLocaleTimeString().replace(/:\d{2}\s/, ' ');
  const [location, setLocation] = useState(null);
  const [locationErr, setLocationErr] = useState(null);
  let tempValue = temperatureUnit === 'Fahrenheit' ? (temperature * 9) / 5 + 32 : temperature;
  const [fontsLoaded] = useFonts(customFonts);

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

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.timeLocationContainer}>
        <View style={styles.timeContainer}>
          <FontAwesome name="clock-o" size={20} color="black" style={styles.clockIcon} />
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>
        {location ? (
          <Text style={styles.locationText}>
            <FontAwesome name="map-marker" size={24} color="black" /> {location.city}, {location.state}
          </Text>
        ) : (
          <Text>{locationErr}</Text>
        )}
      </View>

      <View style={styles.temperatureContainer}>
        <View style={styles.temperatureContent}>
          <FontAwesome name="thermometer" size={72} color="black" style={styles.temperatureIcon} />
          <Text style={styles.temperatureText}>
            {temperature !== null ? `${Math.round(tempValue)}˚${temperatureUnit === 'Fahrenheit' ? 'F' : 'C'}` : '...'}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.parameterText}>
          <FontAwesome name="tint" size={24} color="black" /> Humidity: {humidity} %
        </Text>
        <Text style={styles.parameterText}>
          <FontAwesome name="flask" size={24} color="black" /> Formaldehyde Levels: {form} ppm
        </Text>
        <Text style={styles.parameterText}>
          <FontAwesome name="fire" size={24} color="black" /> NOx Index: {nox}
        </Text>
        <Text style={styles.parameterText}>
          <FontAwesome name="leaf" size={24} color="black" /> VOC Index: {voc}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLocationContainer: {
    alignItems: 'center',
    marginBottom: 90,
    marginTop: -69,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontFamily: 'OpenSans',
    fontSize: 40,
    color: 'black',
    marginLeft: 5,
  },
  locationText: {
    fontFamily: 'OpenSans',
    fontSize: 40,
    color: 'black',
    marginBottom: 10,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  temperatureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureIcon: {
    marginRight: 10,
  },
  temperatureText: {
    fontFamily: 'OpenSans',
    fontSize: 100,
    color: 'black',
    marginLeft: 0,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: -50,
  },
  parameterText: {
    fontFamily: 'OpenSans',
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
  },
  clockIcon: {
    marginRight: 5,
  },
});
