import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SettingsPage({ temperatureUnit, setTemperatureUnit }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {/* Appearance Settings */}
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

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.setting}>
          <Text>Enable Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
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
});
