import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert } from 'react-native';
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

const keyAlias = {
  Altitude: 'Altitude (m)',
  Formaldehyde: 'Formaldehyde (PPM)',
  NOX: 'NOX Index',
  VOC: 'VOC Index',
  humidity: 'Humidity (%)',
  pressure: 'Pressure (Pa)',
  temperature: 'Temperature (°C)',
  timestamp: 'Timestamp'
};

const excludedKeys = ['Altitude', 'timestamp']; // Keys to exclude from display and comparison

const AlertsPage = ({ notificationsEnabled }) => {
  const [thresholds, setThresholds] = useState({
    Formaldehyde: '0 PPM',
    NOX: '0',
    VOC: '0',
    humidity: '0 %',
    pressure: '0 Pa',
    temperature: '0 °C',
  });
  const [latestReadings, setLatestReadings] = useState(null);
  const [breachedThresholds, setBreachedThresholds] = useState({});

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
          console.log('Latest Reading:', latestData);
          setLatestReadings(latestData);
          checkBreachedThresholds(latestData); // Check breached thresholds when new data is fetched
        } else {
          console.log('No latest data available');
        }
      } catch (error) {
        console.log('Error fetching latest reading:', error.message);
      }
    };

    fetchLatestReading();
  }, []);

  const checkBreachedThresholds = (latestData) => {
    if (!latestData) {
      console.log('Latest data is null or undefined');
      return;
    }

    const breached = {};

    // Perform comparison with latest readings, excluding Altitude and timestamp
    Object.entries(thresholds).forEach(([key, value]) => {
      if (!excludedKeys.includes(key)) {
        const latestValue = parseFloat(latestData[key]);
        const thresholdValue = parseFloat(value.replace(/[^0-9\.]/g, '')); // Remove units from threshold value

        if (!isNaN(latestValue) && latestValue > thresholdValue) {
          breached[key] = {
            latestValue: `${latestValue}`,
            thresholdValue: `${thresholdValue}`,
            unit: keyAlias[key].split(' ')[1]
          };
        }
      }
    });

    // Set breached thresholds
    setBreachedThresholds(breached);
  };

  const handleInputFocus = (key) => {
    const updatedThresholds = {...thresholds };
    updatedThresholds[key] = ''; // Clear the value to start fresh
    setThresholds(updatedThresholds);
  };

  const saveThresholdSettings = () => {
    console.log('User-defined Thresholds:', thresholds);
    checkBreachedThresholds(latestReadings); // Run comparison when saving thresholds
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        {!notificationsEnabled? (
          <View style={styles.disabledContainer}>
            <Text style={styles.disabledText}>Notifications Disabled</Text>
          </View>
        ) : (
          <>
            {Object.keys(breachedThresholds).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Breached Thresholds</Text>
                {Object.entries(breachedThresholds).map(([key, {latestValue, thresholdValue, unit}]) => (
                  <View key={key} style={styles.breachedContainer}>
                    <Text>{`Threshold of ${keyAlias[key]} was exceeded.`}</Text>
                    <Text>{`Latest reading of ${keyAlias[key].split(' ')[0]} was ${latestValue} ${unit}.`}</Text>
                    <Text>{`Threshold value was ${thresholdValue} ${unit}.`}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.title}></Text>

            {/* Render inputs for threshold settings, excluding Altitude and timestamp */}
            {Object.keys(thresholds).map((key) => {
              if (!excludedKeys.includes(key)) {
                return (
                  <View key={key} style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{`Enter ${keyAlias[key]} threshold:`}</Text>
                    <TextInput
                      style={styles.input}
                      value={thresholds[key]}
                      onChangeText={(value) => setThresholds((prev) => ({ ...prev, [key]: value }))}
                      keyboardType="numeric"
                      placeholder={`Enter ${keyAlias[key]} threshold`}
                      onFocus={() => handleInputFocus(key)}
                    />
                  </View>
                );
              }
              return null;
            })}

            {/* Save Thresholds Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveThresholdSettings}>
              <Text style={styles.saveButtonText}>Save Thresholds</Text>
            </TouchableOpacity>
          </>
        )}
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
    textAlign: 'center', // Center-justify the title
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Center the section title
  },
  breachedContainer: {
    backgroundColor: '#007AFF', // Blue background color
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  disabledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  disabledText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default AlertsPage;