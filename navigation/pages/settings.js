import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Button } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

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

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [thresholds, setThresholds] = useState({
    temperature: '',
    formaldehyde: '',
    nox: '',
    voc: '',
    humidity: '',
    pressure: ''
  });
  const [latestReadings, setLatestReadings] = useState(null);

  useEffect(() => {
    const fetchLatestReading = async () => {
      try {
        const dbRef = ref(getDatabase(app));
        const testingRef = child(dbRef, 'testing');
        const snapshot = await get(testingRef);

        let latestData = null;
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val();
          if (!latestData || data.timestamp > latestData.timestamp) {
            latestData = data;
          }
        });

        if (latestData) {
          setLatestReadings({
            temperature: latestData.temperature,
            formaldehyde: latestData.formaldehyde,
            nox: latestData.nox,
            voc: latestData.voc,
            humidity: latestData.humidity,
            pressure: latestData.pressure
          });
        }
      } catch (error) {
        console.log('Error fetching latest reading:', error.message);
      }
    };

    fetchLatestReading();
  }, []);

  const saveThresholdSettings = () => {
    console.log('User-defined Thresholds:', thresholds);
    console.log('Latest Readings:', latestReadings);

    if (!latestReadings) {
      console.log('No latest readings available.');
      return;
    }

    // Perform comparison
    const {
      temperature,
      formaldehyde,
      nox,
      voc,
      humidity,
      pressure
    } = latestReadings;

    const {
      temperature: tempThreshold,
      formaldehyde: formaldehydeThreshold,
      nox: noxThreshold,
      voc: vocThreshold,
      humidity: humidityThreshold,
      pressure: pressureThreshold
    } = thresholds;

    if (
      temperature >= parseFloat(tempThreshold) &&
      formaldehyde >= parseFloat(formaldehydeThreshold) &&
      nox >= parseFloat(noxThreshold) &&
      voc >= parseFloat(vocThreshold) &&
      humidity >= parseFloat(humidityThreshold) &&
      pressure >= parseFloat(pressureThreshold)
    ) {
      console.log('Latest reading values meet or exceed all threshold values.');
      // Implement further actions here based on the comparison
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.setting}>
            <Text>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.setting}>
            <Text>Enable Notifications</Text>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Threshold Settings</Text>

          {/* Render inputs for threshold settings */}
          {Object.keys(thresholds).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              value={thresholds[key]}
              onChangeText={(value) => setThresholds((prev) => ({ ...prev, [key]: value }))}
              keyboardType="numeric"
              placeholder={`Enter ${key} threshold`}
            />
          ))}

          <View style={{ marginTop: 20 }}>
            <Button title="Save Thresholds" onPress={saveThresholdSettings} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default SettingsPage;
