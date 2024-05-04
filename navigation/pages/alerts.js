import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
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

// Alias mapping for displaying keys with consistent capitalization
const keyAlias = {
  altitude: 'Altitude',
  formaldehyde: 'Formaldehyde',
  NOX: 'NOX',
  VOC: 'VOC',
  humidity: 'Humidity',
  pressure: 'Pressure',
  temperature: 'Temperature',
  timestamp: 'Timestamp'
};

const AlertsPage = () => {
  const [thresholds, setThresholds] = useState({
    altitude: '0',
    formaldehyde: '0',
    NOX: '0',
    VOC: '0',
    humidity: '0',
    pressure: '0',
    temperature: '0',
    timestamp: '0'
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

  const saveThresholdSettings = () => {
    console.log('User-defined Thresholds:', thresholds);
    checkBreachedThresholds(latestReadings); // Run comparison when saving thresholds
  };

  const checkBreachedThresholds = (latestData) => {
    if (!latestData) {
      console.log('Latest data is null or undefined');
      return;
    }

    const breached = {};

    // Perform comparison with latest readings
    Object.entries(thresholds).forEach(([key, value]) => {
      const latestValue = parseFloat(latestData[key]);
      const thresholdValue = parseFloat(value);

      if (!isNaN(latestValue) && latestValue > thresholdValue) {
        breached[key] = latestValue; // Store the latest reading that breached the threshold
      }
    });

    // Set breached thresholds
    setBreachedThresholds(breached);
  };

  // Function to handle onFocus for all TextInput components
  const handleInputFocus = (key) => {
    const updatedThresholds = { ...thresholds };
    updatedThresholds[key] = ''; // Clear the value to start fresh
    setThresholds(updatedThresholds);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView>
        {/* Display breached thresholds with notifications */}
        {Object.keys(breachedThresholds).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breached Thresholds</Text>
            {Object.entries(breachedThresholds).map(([key, latestValue]) => (
              <View key={key} style={styles.breachedContainer}>
                <Text>{`Threshold of ${keyAlias[key]} was exceeded.`}</Text>
                <Text>{`Latest reading of ${keyAlias[key]} was ${latestValue}`}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Title for Threshold Settings */}
        <Text style={styles.title}>Thresholds</Text>

        {/* Render inputs for threshold settings */}
        {Object.keys(thresholds).map((key) => (
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
        ))}

        {/* Save Thresholds Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveThresholdSettings}>
          <Text style={styles.saveButtonText}>Save Thresholds</Text>
        </TouchableOpacity>
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
    textAlign: 'center', // Center the title
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
});

export default AlertsPage;
