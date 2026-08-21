import axios from 'axios'

const airQualityClient = axios.create({
  baseURL: 'https://air-quality-api.open-meteo.com/v1',
  timeout: 10000,
})

export const getAirQuality = (latitude, longitude, { signal, client = airQualityClient } = {}) =>
  client.get('/air-quality', {
    params: {
      latitude,
      longitude,
      current: 'us_aqi,pm2_5',
      timezone: 'Asia/Seoul',
    },
    signal,
  })
