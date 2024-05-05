import * as React from 'react';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

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
  let tempValue = temperatureUnit === 'Fahrenheit'? (temperature * 9 / 5) + 32 : temperature;
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
    <View style={styles.tempContainer}>
      <View style={styles.tempHeader}>
        <Text style={styles.tempText}>
          {temperature!== null? (
            <>{Math.round(tempValue)}˚{temperatureUnit === 'Fahrenheit'? 'F' : 'C'}</>
          ) : (
            <Text>...</Text>
          )}
        </Text>
      </View>

      <View style={styles.locationTimeContainer}>
        {location? (
          <>
            <Text style={styles.timeText}>{formattedTime}</Text>
            <Text style={styles.locationText}>
              {location.city}, {location.state}
            </Text>
          </>
        ) : (
          <Text>{locationErr}</Text>
        )}
      </View>

      <View style={styles.parametersContainer}>
        <Text style={styles.humidityText}>
          Humidity: {humidity} %
        </Text>
        <Text style={styles.formaldehydeText}>
          Formaldehyde Levels: {form} ppm
        </Text>
        <Text style={styles.noxText}>
          NOx Index: {nox}
        </Text>
        <Text style={styles.vocText}>
          VOC Index: {voc}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  tempContainer: {
    flex: 1,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  tempHeader: {
    flexDirection: 'row',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'inline-block',
  },
  tempText: {
    fontFamily: 'OpenSans',
    fontSize: 112,
    color: 'black',
  },
  locationTimeContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
    textAlign: 'center',
  },
  timeText: {
    fontFamily: 'OpenSans',
    fontSize: 50,
    color: 'black',
    textAlign: 'center',
  },
  inText: {
    fontFamily: 'OpenSans',
    fontSize: 32,
    color: 'black',
    textAlign: 'center',
  },
  locationText: {
    fontFamily: 'OpenSans',
    fontSize: 40,
    color: 'black',
    textAlign: 'center',
  },
  parametersContainer: {
    flex: 1,
    backgroundColor: 'white',
    textAlign: 'left',
    marginTop: 50,
    marginLeft: 25,
  },
  humidityText: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    color: 'black',
    textAlign: 'left',
  },
  formaldehydeText: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    color: 'black',
    textAlign: 'left',
  },
  noxText: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    color: 'black',
    textAlign: 'left',
  },
  vocText: {
    fontFamily: 'OpenSans',
    fontSize: 24,
    color: 'black',
    textAlign: 'left',
  },
});