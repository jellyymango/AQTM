import * as React from 'react';
import { View, Text, StyleSheet, useState } from 'react-native';

export default function Dashboard({ navigation }) {
    const weatherData = "78";
    const timeData = "11:59";

    return (
 
        <View style={styles.weatherContainer}>
     
          <View style={styles.headerContainer}>
     
            <Text style={styles.tempText}>
     
              {weatherData}˚
     
            </Text>
     
          </View>
     
          <View
     
            style={{
     
              flex: 1,
     
              justifyContent: "flex-end",
                
              alignItems: "center",
              //marginLeft: 30,
     
              marginBottom: 100,
     
            }}
     
          >
     
            <Text style={{ fontSize: 50, color: "black" }}>
     
              {timeData}

     
            </Text>
     
          </View>
     
        </View>
     
      );
    /*
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                Dashboard
            </Text>
        </View>
    );*/
}

const styles = StyleSheet.create({
 
  weatherContainer: {
 
    flex: 1,
 
    backgroundColor: "white",

    textAlign: "center",
 
  },
 
  headerContainer: {
 
    flexDirection: "row",
 
    marginTop: 250,
 
    justifyContent: "space-around",

    display: "inline-block",
 
  },
 
  tempText: {
 
    fontSize: 72,
 
    color: "#000000",
 
  },
 
});