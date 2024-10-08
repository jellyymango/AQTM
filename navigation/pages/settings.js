import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SettingsPage = ({ temperatureUnit, setTemperatureUnit, notificationsEnabled, setNotificationsEnabled }) => {
  const toggleTemperatureUnit = () => {
    setTemperatureUnit(temperatureUnit === 'Celsius'? 'Fahrenheit' : 'Celsius');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>

      {/* Appearance Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.setting}>
          <Text>Dashboard Temperature Unit:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{temperatureUnit}</Text>
            <View style={{ marginLeft: 10 }}>
              <Switch value={temperatureUnit === 'Fahrenheit'} onValueChange={toggleTemperatureUnit} />
            </View>
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
});

export default SettingsPage;