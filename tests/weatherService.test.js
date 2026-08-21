import test from 'node:test'
import assert from 'node:assert/strict'
import { cities } from '../src/data/cities.js'
import {
  fetchWeatherList,
  fetchWeatherSnapshot,
  getWeatherErrorMessage,
} from '../src/services/weatherService.js'

const city = cities[0]
const currentResponse = {
  data: {
    main: { temp: 20.4, feels_like: 19.8, humidity: 55 },
    wind: { speed: 2.5 },
    weather: [{ id: 800, main: 'Clear', description: '맑음' }],
    dt: 1_700_000_000,
  },
}
const forecastResponse = {
  data: {
    list: [
      {
        dt: 1_700_010_800,
        dt_txt: '2026-08-21 12:00:00',
        main: { temp: 21.2 },
        wind: { speed: 3.2 },
        weather: [{ id: 804, main: 'Clouds', description: '온흐림' }],
        pop: 0.2,
      },
    ],
  },
}
const airQualityResponse = { data: { current: { us_aqi: 45, pm2_5: 8.4 } } }

const successfulProviders = {
  getCurrentWeather: async () => currentResponse,
  getWeatherForecast: async () => forecastResponse,
  getAirQuality: async () => airQualityResponse,
}

test('세 제공자 응답을 화면 모델로 정규화한다', async () => {
  const result = await fetchWeatherSnapshot(city, {
    apiKey: 'test-key',
    apiProviders: successfulProviders,
  })

  assert.equal(result.dataSource, 'live')
  assert.equal(result.temperature, 20)
  assert.equal(result.status, '맑음')
  assert.equal(result.description, '맑은 하늘')
  assert.equal(result.forecast.length, 1)
  assert.equal(result.forecast[0].status, '매우 흐림')
  assert.equal(result.forecast[0].windSpeed, 3.2)
  assert.equal(result.airQuality.usAqi, 45)
  assert.deepEqual(result.warningMessages, [])
})

test('API Key가 없으면 숨기지 않고 데모 데이터 상태를 반환한다', async () => {
  const result = await fetchWeatherSnapshot(city, { apiKey: '' })

  assert.equal(result.dataSource, 'demo')
  assert.equal(result.requiresApiKey, true)
  assert.ok(result.forecast.length > 0)
})

test('보조 API 실패 시 현재 날씨는 유지하고 경고를 분리한다', async () => {
  const result = await fetchWeatherSnapshot(city, {
    apiKey: 'test-key',
    apiProviders: {
      ...successfulProviders,
      getAirQuality: async () => Promise.reject(new Error('air quality unavailable')),
    },
  })

  assert.equal(result.temperature, 20)
  assert.equal(result.airQuality, null)
  assert.ok(result.warningMessages.includes('대기질을 불러오지 못했습니다.'))
})

test('홈 도시 목록에서는 사용하지 않는 단기 예보를 요청하지 않는다', async () => {
  let forecastRequestCount = 0

  const result = await fetchWeatherList([city], {
    apiKey: 'test-key',
    apiProviders: {
      ...successfulProviders,
      getWeatherForecast: async () => {
        forecastRequestCount += 1
        return forecastResponse
      },
    },
  })

  assert.equal(result.weatherList.length, 1)
  assert.equal(result.weatherList[0].forecast.length, 0)
  assert.equal(forecastRequestCount, 0)
})

test('네트워크 실패를 사용자용 오류 문구로 변환한다', async () => {
  const networkError = Object.assign(new Error('Network Error'), { request: {} })

  await assert.rejects(
    fetchWeatherSnapshot(city, {
      apiKey: 'test-key',
      apiProviders: {
        ...successfulProviders,
        getCurrentWeather: async () => Promise.reject(networkError),
      },
    }),
    networkError,
  )
  assert.equal(getWeatherErrorMessage(networkError), '네트워크 연결을 확인하고 다시 시도해 주세요.')
})
