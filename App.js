import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MainContainer from "./navigation/mainContainer";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import Dashboard from "./navigation/pages/dashboard";

const firebaseConfig = {
  apiKey: "AIzaSyCY7Edr61G516jEG8YIOEOqsOddHPFdFSY",
  authDomain: "esp32-aqt.firebaseapp.com",
  databaseURL: "https://esp32-aqt-default-rtdb.firebaseio.com",
  projectId: "esp32-aqt",
  storageBucket: "esp32-aqt.appspot.com",
  messagingSenderId: "402084669048",
  appId: "1:402084669048:web:ffa5b767c4090fb8eeaf8d",
  measurementId: "G-PWF23HQB3X"
};

const app = initializeApp(firebaseConfig);
let data = null;
function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const dbRef = ref(getDatabase(app));

    const getLatestReading = async () => {
      const testingRef = child(dbRef, 'testing');
      
      // Fetch all data from the "testing" folder
      const snapshot = await get(testingRef);
      
      // Initialize variables to store the latest timestamp and corresponding data
      let latestTimestamp = 0;
      let latestData = null;

      // Iterate over the data to find the entry with the highest timestamp
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.timestamp > latestTimestamp) {
          latestTimestamp = data.timestamp;
          latestData = data;
        }
      });

      // If no data is found, log a message
      if (!latestData) {
        console.log("No data available");
        return;
      }

      // Set temperature and humidity based on the data with the highest timestamp
      setTemperature(latestData.temperature);
      setHumidity(latestData.humidity);
    };

    getLatestReading();
  }, []);

  return (
    <Dashboard temperature={temperature} humidity={humidity}/>
  );
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
