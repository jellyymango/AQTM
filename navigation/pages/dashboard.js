import * as React from 'react';
import { View, Text, StyleSheet, useState } from 'react-native';

export default function Dashboard({ navigation }) {
    const weatherData = "78";
    const timeData = "11:59";
    const forecastTitle = "Forecast";
    const weatherDataArray = new Array(7).fill("00");

    return (
 
        <View style={styles.weatherContainer}>
     
          <View style={styles.headerContainer}>
     
            <Text style={styles.tempText}>
     
              {weatherData}
     
            </Text>

            <Text style={styles.degreeSymbol}>
              ˚
            </Text>
     
          </View>
     
          <View style={styles.timeContainer} >
     
            <Text style={styles.timeText}>
     
              {timeData}

            </Text>
     
          </View>

          <View style={styles.forecastTitleContainer}>

                <Text style={styles.forecastTitleText}>

                    {forecastTitle}

                </Text>

                <View style={styles.forecastContainer}>

                    {Array(7).fill(null).map((_, index) => (
                        <WeatherForecast key={index} day={" " + (index === 0 ? "Today" : "Mon Tue Wed Thu Fri Sat Sun".split(" ")[index])} weatherData={weatherDataArray[index]} />
                    ))}

                </View>

            </View>
     
        </View>
     
    );

    
}

const WeatherForecast = ({ day, weatherData }) => {
  return (

      <View style={styles.forecastItemContainer}>
        
          <Text style={styles.forecastItemText}>

              {day}

          </Text>

          <Text style={styles.forecastItemValueText}>

              {weatherData}˚

          </Text>

      </View>

  );
};

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

  timeContainer: {

    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    //marginLeft: 30,
    marginBottom: 100,

  },

  forecastContainer: {

    flexDirection: "row",
    justifyContent: "space-between",
    //marginBottom: 100,
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
 
    fontSize: 72,
    color: "black",
 
  },

  degreeSymbol: {

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