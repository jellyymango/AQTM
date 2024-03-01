import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MainContainer from "./navigation/mainContainer";

function App() {
  return(
    <MainContainer/>
  )
}

export default App;
//style={styles.title}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  temperatureContainer: {
    alignItems: "center",
  },
  temperature: {
    fontSize: 36,
    fontWeight: "bold",
  },
});
