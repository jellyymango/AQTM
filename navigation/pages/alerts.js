import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const AlertPage = () => {
  // Placeholder data for alerts
  const alerts = [
    { id: 1, message: 'Temperature threshold breached: 80°F', time: '10:00 AM' },
    { id: 2, message: 'Temperature threshold breached: 85°F', time: '11:30 AM' },
    { id: 3, message: 'Temperature threshold breached: 90°F', time: '1:45 PM' },
    { id: 4, message: 'Temperature threshold breached: 95°F', time: '3:20 PM' },
    // Add more placeholder alerts as needed
  ];

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.alertContainer}>
      <View style={styles.blueBubble}>
        <Text style={styles.alertMessage}>{item.message}</Text>
        <Text style={styles.alertTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alerts</Text>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  alertContainer: {
    alignItems: 'center',
  },
  blueBubble: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  alertTime: {
    fontSize: 12,
    color: '#fff',
  },
});

export default AlertPage;
