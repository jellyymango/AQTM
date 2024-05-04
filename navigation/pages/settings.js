import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <View style={styles.container}>
      {/* Enable Notifications Container */}
      <View style={styles.topContainer}>
        {/* Enable Notifications Title */}
        <Text style={styles.title}>Enable Notifications</Text>
        
        {/* Enable Notifications Toggle */}
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Light mode background color
    paddingHorizontal: 20,
  },
  topContainer: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Space between title and switch
    alignItems: 'center', // Center items vertically
    marginTop: 40, // Adjust as needed for spacing from top
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Text color
  },
});

export default SettingsPage;
