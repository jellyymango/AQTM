import * as React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const History = ({ navigation }) => {
  const [data, setData] = React.useState([
    {
      labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
      datasets: [
        {
          data: [
            Math.floor(Math.random() * 20) + 50,
            Math.floor(Math.random() * 20) + 50,
            Math.floor(Math.random() * 20) + 50,
            Math.floor(Math.random() * 20) + 50,
            Math.floor(Math.random() * 20) + 50,
            Math.floor(Math.random() * 20) + 50,
            Math.floor(Math.random() * 20) + 50,
            Math.floor(Math.random() * 20) + 50,
          ],
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          strokeWidth: 2,
        },
        { //line 1
            data: [0, 120],
            color: (opacity = 255) => `rgba(255, 255, 255, ${opacity})`, // Transparent line color
            strokeWidth: 0, // Line width
            
          },
      ],
    },
    {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          data: [
            Math.floor(Math.random() * 10) + 50,
            Math.floor(Math.random() * 10) + 50,
            Math.floor(Math.random() * 10) + 50,
            Math.floor(Math.random() * 10) + 50,
            Math.floor(Math.random() * 10) + 50,
            Math.floor(Math.random() * 10) + 50,
            Math.floor(Math.random() * 10) + 50,
          ],
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          strokeWidth: 2,
        },
        { //line 1
            data: [0, 120],
            color: (opacity = 255) => `rgba(255, 255, 255, ${opacity})`, // Transparent line color
            strokeWidth: 0, // Line width
            
          },
      ],
    },
    {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: [
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
            Math.floor(Math.random() * 5) + 50,
          ],
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
          strokeWidth: 2,
        },
        { //line 1
            data: [0, 120],
            color: (opacity = 255) => `rgba(255, 255,255, ${opacity})`, // Transparent line color
            strokeWidth: 0, // Line width
            
          },
      ],
    },
  ]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        onPress={() => navigation.navigate('Dashboard')}
        style={{ fontSize: 26, fontWeight: 'bold' }}>
        History
      </Text>
      <LineChart
        data={data[selectedIndex]}
        width={Dimensions.get('window').width - 32}
        height={560}
        yAxisLabel=""
        yAxisSuffix="°F"
        yAxisInterval={10}
        yAxisMin={40}
        yAxisMax={90}
        chartConfig={{
          backgroundColor: '#f5f5f5',
          backgroundGradientFrom: '#f5f5f5',
          backgroundGradientTo: '#f5f5f5',
          fillShadowGradient: 'transparent',
          useShadowColorFromDataset: true,
         DECIMALPLACES: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{
          marginVertical: 5,
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#000',
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginHorizontal: 10,
            borderRadius: 50,
          }}
          onPress={() => setSelectedIndex(0)}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#000',
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginHorizontal: 10,
            borderRadius: 50,
          }}
          onPress={() => setSelectedIndex(1)}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#000',
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginHorizontal: 10,
            borderRadius: 50,
          }}
          onPress={() => setSelectedIndex(2)}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default History;