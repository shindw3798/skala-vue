export const ACTIVITY_SCORE_RULES = {
  baseScore: 100,
  activities: {
    running: { label: '러닝', temperatureRange: [8, 20], windLimit: 8 },
    walking: { label: '산책', temperatureRange: [5, 25], windLimit: 10 },
    cycling: { label: '자전거', temperatureRange: [10, 24], windLimit: 6 },
  },
  temperature: { penaltyPerDegree: 3, maxPenalty: 30 },
  humidity: { minimum: 30, maximum: 80, lowPenalty: 8, highPenalty: 15 },
  wind: { penaltyPerExcessMps: 3, maxPenalty: 24 },
  precipitation: { rainPenalty: 22, snowPenalty: 30, maxExtraPenalty: 8 },
  airQuality: [
    { minimum: 151, penalty: 35, reason: '대기질이 나쁨 수준입니다.' },
    { minimum: 101, penalty: 25, reason: '민감군에게 나쁜 대기질입니다.' },
    { minimum: 51, penalty: 10, reason: '대기질이 보통 수준입니다.' },
  ],
  grades: [
    { minimum: 85, grade: '매우 좋음' },
    { minimum: 70, grade: '좋음' },
    { minimum: 50, grade: '보통' },
    { minimum: 0, grade: '나쁨' },
  ],
}

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)))

const getRecommendation = (grade, activityLabel) => {
  if (grade === '매우 좋음') return `오늘은 ${activityLabel}하기 매우 좋은 조건입니다.`
  if (grade === '좋음') return `준비 운동을 한 뒤 가볍게 시작해 보세요. (${activityLabel})`
  if (grade === '보통') return `날씨 조건을 확인하며 ${activityLabel} 강도를 낮추세요.`
  return `오늘은 ${activityLabel} 대신 실내 운동을 하는 편이 좋습니다.`
}

export const calculateActivityScore = ({
  activityType = 'running',
  temperature,
  humidity,
  windSpeed,
  weatherCondition = '',
  precipitation = 0,
  airQualityIndex,
}) => {
  const activityRule =
    ACTIVITY_SCORE_RULES.activities[activityType] ?? ACTIVITY_SCORE_RULES.activities.running
  let score = ACTIVITY_SCORE_RULES.baseScore
  const reasons = []

  if (Number.isFinite(temperature)) {
    const [minimumTemperature, maximumTemperature] = activityRule.temperatureRange
    const temperatureDistance =
      temperature < minimumTemperature
        ? minimumTemperature - temperature
        : Math.max(0, temperature - maximumTemperature)
    if (temperatureDistance > 0) {
      const penalty = Math.min(
        ACTIVITY_SCORE_RULES.temperature.maxPenalty,
        temperatureDistance * ACTIVITY_SCORE_RULES.temperature.penaltyPerDegree,
      )
      score -= penalty
      reasons.push(`적정 기온 범위에서 ${temperatureDistance}℃ 벗어나 ${penalty}점 감점됐습니다.`)
    }
  }

  if (Number.isFinite(humidity)) {
    if (humidity > ACTIVITY_SCORE_RULES.humidity.maximum) {
      score -= ACTIVITY_SCORE_RULES.humidity.highPenalty
      reasons.push(`습도가 ${humidity}%로 너무 높아 15점 감점됐습니다.`)
    } else if (humidity < ACTIVITY_SCORE_RULES.humidity.minimum) {
      score -= ACTIVITY_SCORE_RULES.humidity.lowPenalty
      reasons.push(`습도가 ${humidity}%로 너무 낮아 8점 감점됐습니다.`)
    }
  }

  if (Number.isFinite(windSpeed) && windSpeed > activityRule.windLimit) {
    const penalty = Math.min(
      ACTIVITY_SCORE_RULES.wind.maxPenalty,
      Math.round(
        (windSpeed - activityRule.windLimit) * ACTIVITY_SCORE_RULES.wind.penaltyPerExcessMps,
      ),
    )
    score -= penalty
    reasons.push(
      `풍속이 ${windSpeed}m/s로 ${activityRule.label} 기준보다 강해 ${penalty}점 감점됐습니다.`,
    )
  }

  const normalizedCondition = String(weatherCondition).toLocaleLowerCase()
  const hasSnow = normalizedCondition.includes('snow') || normalizedCondition.includes('눈')
  const hasRain =
    Number(precipitation) > 0 ||
    normalizedCondition.includes('rain') ||
    normalizedCondition.includes('비')
  if (hasSnow || hasRain) {
    const basePenalty = hasSnow
      ? ACTIVITY_SCORE_RULES.precipitation.snowPenalty
      : ACTIVITY_SCORE_RULES.precipitation.rainPenalty
    const extraPenalty = Math.min(
      ACTIVITY_SCORE_RULES.precipitation.maxExtraPenalty,
      Math.max(0, Math.round(Number(precipitation) || 0)),
    )
    const penalty = basePenalty + extraPenalty
    score -= penalty
    reasons.push(`${hasSnow ? '눈' : '비'} 조건으로 ${penalty}점 감점됐습니다.`)
  }

  if (Number.isFinite(airQualityIndex)) {
    const airQualityRule = ACTIVITY_SCORE_RULES.airQuality.find(
      (rule) => airQualityIndex >= rule.minimum,
    )
    if (airQualityRule) {
      score -= airQualityRule.penalty
      reasons.push(`${airQualityRule.reason} ${airQualityRule.penalty}점 감점됐습니다.`)
    }
  } else {
    reasons.push('대기질 정보가 없어 AQI는 점수에 반영하지 않았습니다.')
  }

  const finalScore = clampScore(score)
  const grade = ACTIVITY_SCORE_RULES.grades.find((item) => finalScore >= item.minimum).grade

  return {
    score: finalScore,
    grade,
    reasons: reasons.length ? reasons : ['현재 조건에서 큰 감점 요인이 없습니다.'],
    recommendation: getRecommendation(grade, activityRule.label),
  }
}

export const activityOptions = Object.entries(ACTIVITY_SCORE_RULES.activities).map(
  ([value, rule]) => ({ value, label: rule.label }),
)

export const findBestActivityForecast = ({
  forecast = [],
  activityType = 'running',
  airQualityIndex,
} = {}) => {
  const evaluatedForecast = forecast
    .filter((item) => item?.dateTime && Number.isFinite(item.temperature))
    .map((item) => ({
      forecast: item,
      insight: calculateActivityScore({
        activityType,
        temperature: item.temperature,
        humidity: item.humidity,
        windSpeed: item.windSpeed,
        weatherCondition: item.weatherCondition,
        precipitation: item.precipitation,
        airQualityIndex,
      }),
    }))

  if (!evaluatedForecast.length) return null

  const best = evaluatedForecast.reduce((bestCandidate, candidate) => {
    if (candidate.insight.score > bestCandidate.insight.score) return candidate
    if (candidate.insight.score < bestCandidate.insight.score) return bestCandidate
    return new Date(candidate.forecast.dateTime) < new Date(bestCandidate.forecast.dateTime)
      ? candidate
      : bestCandidate
  })

  return { ...best, airQualityApplied: Number.isFinite(airQualityIndex) }
}
