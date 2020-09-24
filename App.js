import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location'
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import { colors } from './utils/index'
import ReloadIcon from './components/ReloadIcon';
import WeatherDetails from './components/WeatherDetails';
import { WEATHER_API_KEY } from 'react-native-dotenv'

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {
  const [errMsg, setErrMsg] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitsSystem, setUnitsSystem] = useState('metric')

  useEffect(() => {
    load()
  }, [unitsSystem])

  async function load() {
    setCurrentWeather(null)
    setErrMsg(null)
    try {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        setErrMsg('Access to location is needed to run the app')
        return
      }
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
      const { latitude, longitude } = location.coords
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`

      const response = await fetch(weatherUrl)
      const result = await response.json()

      if (response.ok) {
        setCurrentWeather(result)
      } else {
        setErrMsg(result.message)
      }


    } catch (error) {
      setErrMsg(error.message)
    }
  }

  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem} />
          <ReloadIcon load={load}/>
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem} />
      </View>
    );
  } else if (errMsg) {
    return (
      <View style={styles.container}>
        <ReloadIcon load={load}/>
        <Text style={{ textAlign: 'center' }}>{errMsg}</Text>
        <StatusBar style="auto" />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={colors.PRIMARY} />
        <StatusBar style="auto" />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1
  }
});
