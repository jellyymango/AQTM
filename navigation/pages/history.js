import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getDatabase, ref, child, get } from "firebase/database";
import { initializeApp } from "firebase/app"; // Import initializeApp from Firebase

// Function to convert Unix timestamp to JavaScript Date object
function unixTimestampToDate(unixTimestamp) {
    return new Date(unixTimestamp * 1000);
}

function averageData(data, targetSize) {
  if (data.length <= targetSize) {
    return data; // Return the original data if its length is less than or equal to the target size
  }

  const intervalSize = Math.ceil(data.length / targetSize); // Calculate the interval size
  const averagedData = []; // Array to store averaged data

  // Loop through the original data array in intervals
  for (let i = 0; i < data.length; i += intervalSize) {
    let sum = 0;
    let count = 0;

    // Calculate the sum of data points in the current interval
    for (let j = i; j < i + intervalSize && j < data.length; j++) {
      sum += parseFloat(data[j]); // Parse the value as a float before adding to the sum
      count++;
    }

    // Calculate the average of the current interval
    const average = count > 0 ? sum / count : 0; // Prevent division by zero

    // Add the average to the averagedData array
    averagedData.push(average);
  }

  return averagedData;
}

const History = ({ navigation }) => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [previousDayTimestamps, setPreviousDayTimestamps] = useState([]);
  const [previousWeekTimestamps, setPreviousWeekTimestamps] = useState([]);
  const [previousMonthTimestamps, setPreviousMonthTimestamps] = useState([]);

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
  
    const readAllData = async () => {
      const testingRef = child(dbRef, 'testing');
  
      // Fetch all data from the "testing" folder
      const snapshot = await get(testingRef);
  
      // Initialize arrays to store temperature and humidity data
      let temperatureReadings = [];
      let humidityReadings = [];
      let previousDayTimestampsArr = [];
      let previousWeekTimestampsArr = [];
      let previousMonthTimestampsArr = [];
  
      // Iterate over all readings
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const timestamp = data.timestamp;
        // Push temperature and humidity data to respective arrays
        temperatureReadings.push(data.temperature);
        humidityReadings.push(data.humidity);
        // Check if the timestamp is within the previous day, week, or month
        const date = unixTimestampToDate(timestamp);
        const currentDate = new Date();
        const oneDayAgo = new Date(currentDate);
        oneDayAgo.setDate(currentDate.getDate() - 1);
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);
        if (date > oneDayAgo) {
          previousDayTimestampsArr.push(timestamp);
        }
        if (date > oneWeekAgo) {
          previousWeekTimestampsArr.push(timestamp);
        }
        if (date > oneMonthAgo) {
          previousMonthTimestampsArr.push(timestamp);
        }
      });
  
      // Update state with the arrays of temperature and humidity data
      setTemperatureData(temperatureReadings);
      setHumidityData(humidityReadings);
      setPreviousDayTimestamps(previousDayTimestampsArr);
      setPreviousWeekTimestamps(previousWeekTimestampsArr);
      setPreviousMonthTimestamps(previousMonthTimestampsArr);
    };
  
    readAllData(); // Call the function to fetch all data when the component mounts
  
  }, [app]); // Add app to dependency array to trigger useEffect when it changes

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  let dailyData = temperatureData.slice(Math.max(temperatureData.length - 100, 0)).reverse();
  let weeklyData = temperatureData.slice(Math.max(temperatureData.length - 750, 0)).reverse();
  let monthlyData = temperatureData.slice(Math.max(temperatureData.length - 150000, 0)).reverse();
  const data = [
    {
      labels: previousDayTimestamps
        .filter((_, index) => index % Math.ceil(previousDayTimestamps.length / 4) === 0)
        .map(timestamp => {
          const date = unixTimestampToDate(timestamp);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Only time without seconds
        }),
      datasets: [
        {
          data: averageData(dailyData,50),
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: [],
          color: (opacity = 255) => `rgba(255, 255, 255, ${opacity})`, // Transparent line color
          strokeWidth: 0, // Line width
        },
      ],
    },
    {
      labels: previousWeekTimestamps
        .filter((_, index) => index % Math.ceil(previousWeekTimestamps.length / 5) === 0)
        .map(timestamp => unixTimestampToDate(timestamp).toLocaleDateString()),
      datasets: [
        {
          data: averageData(weeklyData,50),
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          strokeWidth: 2,
        },
        { //line 1
            data: [],
            color: (opacity = 255) => `rgba(255, 255, 255, ${opacity})`, // Transparent line color
            strokeWidth: 0, // Line width
            
          },
      ],
    },
    {
      labels: previousMonthTimestamps
        .filter((_, index) => index % Math.ceil(previousMonthTimestamps.length / 4) === 0) // Reduce by one label
        .map(timestamp => unixTimestampToDate(timestamp).toLocaleDateString()),
      datasets: [
        {
          data: averageData(monthlyData,50),
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
          strokeWidth: 2,
        },
        { //line 1
            data: [],
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
        yAxisSuffix="°C"
        yAxisInterval={5}
        yAxisMin={10}
        yAxisMax={50}
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
            // Convert Unix timestamp to human-readable date
            return value; // You can format the label as needed
          },
          formatYLabel: (value) => {
            // Customize the Y-axis labels here
            return value.toString(); // You can format the label as needed
          },
        }}
        style={{
          marginVertical: 5,
          borderRadius: 16,
          backgroundColor: 'white', // Set background color
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