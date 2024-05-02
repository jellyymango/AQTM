import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getDatabase, ref, child, get } from "firebase/database";
import { initializeApp } from "firebase/app"; // Import initializeApp from Firebase

const History = ({ navigation }) => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);

  // Initialize Firebase app
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

  useEffect(() => {
    const dbRef = ref(getDatabase(app));

    const read25 = async () => {
      const testingRef = child(dbRef, 'testing');

      // Fetch the last 25 readings from the "testing" folder
      const snapshot = await get(testingRef);

      // Initialize arrays to store temperature and humidity data
      let temperatureReadings = [];
      let humidityReadings = [];

      // Iterate over the last 25 readings
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        // Push temperature and humidity data to respective arrays
        temperatureReadings.push(data.temperature);
        //humidityReadings.push(data.humidity);
      });

      // Update state with the arrays of temperature and humidity data
      setTemperatureData(temperatureReadings);
      setHumidityData(humidityReadings);

      console.log("Temperature Readings:", temperatureReadings);
      //console.log("Humidity Readings:", humidityReadings);
    };

    read25();
  }, [app]); // Add app to dependency array to trigger useEffect when it changes

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const data = [
    {
      labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
      datasets: [
        {
          data: temperatureData.slice(0, 15),
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: [21, 23],
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
  ];

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
        yAxisSuffix="°C" // Change the yAxisSuffix if needed
        yAxisInterval={5} // Adjust yAxisInterval according to your preference
        yAxisMin={10} // Set the minimum value of the y-axis
        yAxisMax={50} // Set the maximum value of the y-axis
        chartConfig={{
          backgroundColor: '#f5f5f5',
          backgroundGradientFrom: '#f5f5f5',
          backgroundGradientTo: '#f5f5f5',
          fillShadowGradient: 'transparent',
          useShadowColorFromDataset: true,
          DECIMALPLACES: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          formatXLabel: (value) => {
            // Customize the X-axis labels here
            return value.toString(); // You can format the label as needed
          },
          formatYLabel: (value) => {
            // Customize the Y-axis labels here
            return value.toString(); // You can format the label as needed
          },
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
