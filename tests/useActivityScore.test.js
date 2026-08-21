import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateActivityScore,
  findBestActivityForecast,
} from '../src/composables/useActivityScore.js'

test('좋은 조건은 100점과 매우 좋음 등급을 반환한다', () => {
  const result = calculateActivityScore({
    activityType: 'running',
    temperature: 15,
    humidity: 55,
    windSpeed: 2,
    weatherCondition: 'Clear',
    precipitation: 0,
    airQualityIndex: 30,
  })

  assert.equal(result.score, 100)
  assert.equal(result.grade, '매우 좋음')
  assert.deepEqual(result.reasons, ['현재 조건에서 큰 감점 요인이 없습니다.'])
})

test('비와 나쁜 대기질의 감점 사유를 보여 주고 점수를 0 이상으로 제한한다', () => {
  const result = calculateActivityScore({
    activityType: 'cycling',
    temperature: 40,
    humidity: 95,
    windSpeed: 20,
    weatherCondition: 'Rain',
    precipitation: 12,
    airQualityIndex: 180,
  })

  assert.equal(result.score, 0)
  assert.equal(result.grade, '나쁨')
  assert.ok(result.reasons.some((reason) => reason.includes('비 조건')))
  assert.ok(result.reasons.some((reason) => reason.includes('대기질')))
})

test('활동별 기준에 따라 같은 날씨에도 점수가 달라진다', () => {
  const weather = {
    temperature: 7,
    humidity: 50,
    windSpeed: 7,
    weatherCondition: 'Clear',
    precipitation: 0,
    airQualityIndex: 20,
  }

  const walking = calculateActivityScore({ ...weather, activityType: 'walking' })
  const cycling = calculateActivityScore({ ...weather, activityType: 'cycling' })

  assert.ok(walking.score > cycling.score)
})

test('단기 예보 중 활동 점수가 가장 높은 시간을 추천한다', () => {
  const forecast = [
    {
      id: 'rainy',
      dateTime: '2026-08-21T03:00:00.000Z',
      temperature: 18,
      humidity: 90,
      windSpeed: 9,
      weatherCondition: 'Rain',
      precipitation: 4,
      precipitationProbability: 90,
      status: '비',
    },
    {
      id: 'clear',
      dateTime: '2026-08-21T06:00:00.000Z',
      temperature: 17,
      humidity: 55,
      windSpeed: 2,
      weatherCondition: 'Clear',
      precipitation: 0,
      precipitationProbability: 10,
      status: '맑은 하늘',
    },
  ]

  const result = findBestActivityForecast({
    forecast,
    activityType: 'running',
    airQualityIndex: 30,
  })

  assert.equal(result.forecast.id, 'clear')
  assert.equal(result.insight.score, 100)
  assert.equal(result.airQualityApplied, true)
})

test('추천할 단기 예보가 없으면 null을 반환한다', () => {
  assert.equal(findBestActivityForecast({ forecast: [] }), null)
})
