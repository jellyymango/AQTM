import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

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
let temperatureValue = null;

function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {

    const dbRef = ref(getDatabase(app));

    const getFirstReading = async () => {
      get(child(dbRef, `testing/1711596706`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          console.log(data.temperature);
          temperatureValue = data.temperature;
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    };
    getFirstReading();
  }, []);

  return (
    <Dashboard temperature={temperature} humidity={humidity} />
  );
}

export default function Dashboard({ navigation, temperature, humidity }) {
  const location = "San Jose, CA";
  const timeData = "11:59";
  const forecastTitle = "Forecast";
  const weatherDataArray = new Array(7).fill("70");

  return (
    <View style={styles.weatherContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>
          
          {temperatureValue}˚
        </Text>

        <Text style={styles.degreeSymbol}>
          ˚
        </Text>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>
          {location}
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {timeData}
        </Text>
      </View>

      <View style={styles.forecastTitleContainer}>
        <Text style={styles.forecastTitleText}>
          {forecastTitle}
        </Text>

        <View style={styles.forecastContainer}>
          {Array(7).fill(null).map((_, index) => (
            <WeatherForecast key={index} day={" " + (index === 0? "Today" : "Mon Tue Wed Thu Fri Sat Sun".split(" ")[index])} weatherData={weatherDataArray[index]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const WeatherForecast = ({ day, weatherData }) => {
  return (
    <View style={styles.forecastItemContainer}>
      <Text style={styles.forecastItemText}>
        {day}
      </Text>

      <Text style={styles.forecastItemValueText}>
        {weatherData}˚
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
    display: "inline-block",
  },
  locationContainer: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "center",
  },
  locationText: {
    fontSize: 40,
    color: "black",
    textAlign: "center",
  },
  timeContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 100,
  },
  forecastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 12,
  },
  forecastItemContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    width: "14%",
    alignItems: "center",
    justifyContent: "center",
  },
  forecastItemText: {
    fontSize: 15,
    color: "black",
  },
  forecastItemValueText: {
    fontSize: 20,
    color: "black",
    marginTop: 10,
  },
  forecastTitleText: {
    fontSize: 40,
    color: "black",
    alignSelf: "center",
  },
  forecastTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  tempText: {
    fontSize: 96,
    color: "black",
  },
  degreeSymbol:{
    fontSize: 72,
    //position: 'absolute',
    //right: -20,
    //top: -16,
  },
  timeText: {
    fontSize: 50,
    color: "black",
  },
});