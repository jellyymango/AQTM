import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
import Dashboard from "./navigation/pages/dashboard";
import History from "./navigation/pages/history";
import Settings from "./navigation/pages/settings";
import Alerts from "./navigation/pages/alerts";

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

const Tab = createBottomTabNavigator();

export default function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('Fahrenheit');

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
    <NavigationContainer>
      <Tab.Navigator
          initialRouteName="Dashboard"
          screenOptions={({ route }) => ({
              // Tab Bar Options:
              activeTintColor: 'blue',
              inactiveTintColor: 'grey',
              labelStyle: { paddingBottom: 10, fontSize: 10 },
              style: { padding: 10, height: 70 },
              // Tab Bar Icons
              tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  const routeName = route.name;

                  if (routeName === "Dashboard") {
                      iconName = focused ? 'home' : 'home-outline';
                  } else if (routeName === "History") {
                      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                  }  else if (routeName === "Alerts") {
                      iconName = focused ? 'warning' : 'warning-outline';
                  }  else if (routeName === "Settings") {
                      iconName = focused ? 'settings' : 'settings-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
              },
          })}
      >
          <Tab.Screen name="Dashboard">
              {() => <Dashboard temperature={temperature} humidity={humidity} temperatureUnit={temperatureUnit} />}
          </Tab.Screen>
          <Tab.Screen name="History" component={History} />
          <Tab.Screen name="Alerts" component={Alerts} />
          <Tab.Screen name="Settings">
              {() => <Settings temperatureUnit={temperatureUnit} setTemperatureUnit={setTemperatureUnit} />}
          </Tab.Screen>
          
      </Tab.Navigator>
    </NavigationContainer>
  );
}
