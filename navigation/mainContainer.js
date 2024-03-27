import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from './pages/dashboard';
import History from './pages/history';
import Settings from './pages/settings';
import Alerts from './pages/alerts';

const homeName = "Dashboard";
const historyName = "History";
const settingsName = "Settings";
const alertsName = "Alerts";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({ route }) => ({
                    
                    //  Tab Bar Options:
                    activeTintColor: 'blue',
                    inactiveTintColor: 'grey',
                    labelStyle: { paddingBottom: 10, fontSize: 10 },
                    style: { padding: 10, height: 70 },
                    
                    //  Tab Bar Icons
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let rtName = route.name;

                        if (rtName === homeName) {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (rtName === historyName) {
                            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                        } else if (rtName === settingsName) {
                            iconName = focused ? 'settings' : 'settings-outline';
                        } else if (rtName === alertsName) {
                            iconName = focused ? 'warning' : 'warning-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name={homeName} component={Dashboard} />
                <Tab.Screen name={historyName} component={History} />
                <Tab.Screen name={settingsName} component={Settings} />
                <Tab.Screen name={alertsName} component={Alerts} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
