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

    const getFirstReading = async () => {
      get(child(dbRef, `testing/1711596706`)).then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          console.log(data.temperature);
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    };
    getFirstReading();
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
