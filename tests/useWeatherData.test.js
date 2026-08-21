import test from 'node:test'
import assert from 'node:assert/strict'
import { useWeatherData } from '../src/composables/useWeatherData.js'

const createDeferred = () => {
  let resolve
  const promise = new Promise((resolver) => {
    resolve = resolver
  })
  return { promise, resolve }
}

const snapshot = (city) => ({
  ...city,
  temperature: 20,
  feelsLike: 20,
  humidity: 50,
  windSpeed: 2,
  precipitation: 0,
  weatherCondition: 'Clear',
  status: '맑음',
  description: '맑음',
  observedAt: '2026-08-21T00:00:00.000Z',
  forecast: [],
  airQuality: { usAqi: 20, pm25: 4, grade: '좋음' },
  lastUpdatedAt: '2026-08-21T00:00:00.000Z',
  dataSource: 'live',
  requiresApiKey: false,
  warningMessages: [],
})

test('빠른 도시 전환에서는 가장 최근 요청만 화면 상태를 갱신한다', async () => {
  const first = createDeferred()
  const second = createDeferred()
  const fetcher = (city) => (city.id === 'first' ? first.promise : second.promise)
  const weather = useWeatherData({ fetcher })
  const firstCity = { id: 'first', nameKo: '첫 도시' }
  const secondCity = { id: 'second', nameKo: '둘째 도시' }

  const firstRequest = weather.loadCityWeather(firstCity)
  const secondRequest = weather.loadCityWeather(secondCity)
  assert.equal(weather.currentWeather.value, null)

  second.resolve(snapshot(secondCity))
  assert.equal(await secondRequest, true)
  first.resolve(snapshot(firstCity))
  assert.equal(await firstRequest, false)

  assert.equal(weather.currentWeather.value.id, 'second')
  assert.equal(weather.isLoading.value, false)
})

test('도시가 없으면 빈 데이터와 명확한 오류 상태를 유지한다', async () => {
  const weather = useWeatherData()

  assert.equal(await weather.loadCityWeather(null), false)
  assert.equal(weather.currentWeather.value, null)
  assert.equal(weather.errorMessage.value, '요청한 도시를 찾을 수 없습니다.')
})
