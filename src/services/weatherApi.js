import axios from 'axios'

const openWeatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

const commonParams = () => ({
  units: 'metric',
  lang: 'kr',
})

export const getOpenWeatherApiKey = () => import.meta.env?.VITE_OPENWEATHER_API_KEY?.trim() ?? ''

export const hasOpenWeatherApiKey = (apiKey = getOpenWeatherApiKey()) => Boolean(apiKey)

export const getCurrentWeather = (
  latitude,
  longitude,
  { signal, apiKey = getOpenWeatherApiKey(), client = openWeatherClient } = {},
) =>
  client.get('/weather', {
    params: { ...commonParams(), appid: apiKey, lat: latitude, lon: longitude },
    signal,
  })

export const getWeatherForecast = (
  latitude,
  longitude,
  { signal, apiKey = getOpenWeatherApiKey(), client = openWeatherClient } = {},
) =>
  client.get('/forecast', {
    params: { ...commonParams(), appid: apiKey, lat: latitude, lon: longitude, cnt: 8 },
    signal,
  })
