import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';

export default function SettingsPage({ temperatureUnit, setTemperatureUnit }) {
  // State variables for appearance and notification settings
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // State variables for threshold settings
  const [temperatureThreshold, setTemperatureThreshold] = useState('');
  const [formaldehydeThreshold, setFormaldehydeThreshold] = useState('');
  const [noxThreshold, setNOXThreshold] = useState('');
  const [vocThreshold, setVOCTreshold] = useState('');
  const [humidityThreshold, setHumidityThreshold] = useState('');
  const [pressureThreshold, setPressureThreshold] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* Display appearance settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.setting}>
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View style={styles.setting}>
        <Text>Temperature Unit:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{temperatureUnit === 'Fahrenheit'? 'Fahrenheit' : 'Celsius'}</Text>
            <View style={{ width: 10 }} /> 
            <Switch
              value={temperatureUnit === 'Fahrenheit'}
              onValueChange={() => setTemperatureUnit(temperatureUnit === 'Fahrenheit'? 'Celsius' : 'Fahrenheit')}
            />
          </View>
        </View>
        
      </View>
      {/* Display notification settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.setting}>
          <Text>Enable Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
      </View>
      {/* Display settings for temperature, formaldehyde, NOX, VOC, humidity, and pressure thresholds */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Threshold Settings</Text>
        <Text style={styles.settingLabel}>Temperature Threshold:</Text>
        <TextInput
          style={styles.input}
          value={temperatureThreshold}
          onChangeText={setTemperatureThreshold}
          keyboardType="numeric"
          placeholder="Enter temperature threshold"
        />
        <Text style={styles.settingLabel}>Formaldehyde Threshold:</Text>
        <TextInput
          style={styles.input}
          value={formaldehydeThreshold}
          onChangeText={setFormaldehydeThreshold}
          keyboardType="numeric"
          placeholder="Enter formaldehyde threshold"
        />
        <Text style={styles.settingLabel}>NOX Threshold:</Text>
        <TextInput
          style={styles.input}
          value={noxThreshold}
          onChangeText={setNOXThreshold}
          keyboardType="numeric"
          placeholder="Enter NOX threshold"
        />
        <Text style={styles.settingLabel}>VOC Threshold:</Text>
        <TextInput
          style={styles.input}
          value={vocThreshold}
          onChangeText={setVOCTreshold}
          keyboardType="numeric"
          placeholder="Enter VOC threshold"
        />
        <Text style={styles.settingLabel}>Humidity Threshold:</Text>
        <TextInput
          style={styles.input}
          value={humidityThreshold}
          onChangeText={setHumidityThreshold}
          keyboardType="numeric"
          placeholder="Enter humidity threshold"
        />
        <Text style={styles.settingLabel}>Pressure Threshold:</Text>
        <TextInput
          style={styles.input}
          value={pressureThreshold}
          onChangeText={setPressureThreshold}
          keyboardType="numeric"
          placeholder="Enter pressure threshold"
        />
      </View>
    </View>
  );
}

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
  settingLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
