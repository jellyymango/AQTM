import * as React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const History = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        onPress={() => navigation.navigate('Dashboard')}
        style={{ fontSize: 26, fontWeight: 'bold' }}>
        History
      </Text>
      <LineChart
        data={{
          labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
          datasets: [
            { //line 1
              data: [0, 120],
              color: (opacity = 255) => `rgba(255, 255, 255, ${opacity})`, // Transparent line color
              strokeWidth: 0, // Line width
              
            },
            {
              data: [
                Math.floor(Math.random() * 20) + 50, // Convert to Fahrenheit
                Math.floor(Math.random() * 20) + 50,
                Math.floor(Math.random() * 20) + 50,
                Math.floor(Math.random() * 20) + 50,
                Math.floor(Math.random() * 20) + 50,
                Math.floor(Math.random() * 20) + 50,
                Math.floor(Math.random() * 20) + 50,
                Math.floor(Math.random() * 20) + 50,
              ],
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Line color
              strokeWidth: 2, // Line width
            },
          ],
        }}
        width={Dimensions.get('window').width - 32} // Adjust width as needed
        height={560}
        yAxisLabel="" // Fahrenheit
        yAxisSuffix="°F"
        yAxisInterval={16} // Interval between Y-axis labels
        yAxisMin={32} // Minimum value for Y-axis
        yAxisMax={120} // Maximum value for Y-axis
        chartConfig={{
          backgroundColor: '#f5f5f5', // Change background color
          backgroundGradientFrom: '#f5f5f5', // Gradient start color
          backgroundGradientTo: '#f5f5f5', // Gradient end color
          fillShadowGradient: 'transparent',
          fromZero: true,
          useShadowColorFromDataset: true,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Line color
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // X and Y axis labels color
          style: {
            borderRadius: 16,
            marginVertical: -10, // Adjust bottom margin to push x-axis closer to bezier shadow
          },
          propsForDots: {
            r: '0', // Dot size
            strokeWidth: '',
            stroke: '#ffa726', // Dot color
          },
        }}
        bezier
        style={{
          marginVertical: 10,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      />
    </View>
  );
};

export default History;
