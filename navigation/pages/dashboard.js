import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Dashboard({temperature, humidity }) {
  const location = "San Jose, CA";
  const timeData = "11:59";
  const forecastTitle = "Forecast";
  const weatherDataArray = new Array(7).fill("70");
  //console.log(temperature);
  //console.log(humidity);

  return (
    <View style={styles.weatherContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>
          
          {temperature}˚
        </Text>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>
          {location}
        </Text>
      </View>

      <View style = {styles.humidityContainer}>
        <Text style = {styles.humidityText}>
          Humidity: {humidity} %

        </Text>

      </View>

      

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {timeData}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
    display: "inline-block",
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
  forecastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 12,
  },
  forecastItemContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    width: "14%",
    alignItems: "center",
    justifyContent: "center",
  },
  forecastItemText: {
    fontSize: 15,
    color: "black",
  },
  forecastItemValueText: {
    fontSize: 20,
    color: "black",
    marginTop: 10,
  },
  forecastTitleText: {
    fontSize: 40,
    color: "black",
    alignSelf: "center",
  },
  forecastTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  tempText: {
    fontSize: 96,
    color: "black",
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