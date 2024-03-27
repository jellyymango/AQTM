/*
import * as React from 'react';
import { View, Text } from 'react-native';

export default function Dashboard({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                Dashboard
            </Text>
        </View>
    );
}
*/

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const Weather = ({ widgetNumber }) => {
  return (
    <View style={styles.weatherContainer}>
      <View style={styles.titleContainer}>
        {widgetNumber === 10 ? (
          <Feather name="cloud-snow" size={58} color="#00ffff" />
        ) : null}
        <Text style={styles.tempText}>Live temperature </Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>So Chilled outside!!</Text>
        <Text style={styles.subtitle}>My hands are getting cold.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    backgroundColor: "#f8f8ff",
  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tempText: {
    fontSize: 40,
    color: "#00ffff",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: 25,
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    color: "#00ffff",
  },
  subtitle: {
    fontSize: 26,
    color: "#00ffff",
  },
});

export default Weather;
