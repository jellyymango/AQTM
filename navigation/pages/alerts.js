import * as React from 'react';
import { View, Text } from 'react-native';

export default function Alerts({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                Alerts
            </Text>
        </View>
    );
}
