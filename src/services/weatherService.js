import axios from 'axios'
import { createDemoWeatherSnapshot } from '../data/cities.js'
import { getAirQuality } from './airQualityApi.js'
import {
  getCurrentWeather,
  getOpenWeatherApiKey,
  getWeatherForecast,
  hasOpenWeatherApiKey,
} from './weatherApi.js'

const providers = { getCurrentWeather, getWeatherForecast, getAirQuality }

const WEATHER_GROUP_LABELS = {
  Thunderstorm: '천둥번개',
  Drizzle: '이슬비',
  Rain: '비',
  Snow: '눈',
  Mist: '안개',
  Smoke: '연기',
  Haze: '연무',
  Dust: '먼지',
  Fog: '안개',
  Sand: '황사',
  Ash: '화산재',
  Squall: '돌풍',
  Tornado: '토네이도',
  Clear: '맑음',
  Clouds: '흐림',
}

const WEATHER_CODE_DESCRIPTIONS = {
  500: '약한 비',
  501: '비',
  502: '강한 비',
  503: '매우 강한 비',
  504: '극심한 비',
  511: '어는 비',
  520: '약한 소나기',
  521: '소나기',
  522: '강한 소나기',
  531: '불규칙한 소나기',
  600: '약한 눈',
  601: '눈',
  602: '강한 눈',
  611: '진눈깨비',
  612: '약한 소낙성 진눈깨비',
  613: '소낙성 진눈깨비',
  615: '약한 비와 눈',
  616: '비와 눈',
  620: '약한 소낙눈',
  621: '소낙눈',
  622: '강한 소낙눈',
  701: '옅은 안개',
  711: '연기',
  721: '연무',
  731: '모래·먼지 소용돌이',
  741: '짙은 안개',
  751: '황사',
  761: '먼지',
  762: '화산재',
  771: '돌풍',
  781: '토네이도',
  800: '맑은 하늘',
  801: '구름 조금',
  802: '구름 많음',
  803: '흐림',
  804: '매우 흐림',
}

const normalizeProviderDescription = (description = '') =>
  String(description)
    .trim()
    .replace(/^온흐림$/, '매우 흐림')
    .replace(/^실\s*비$/, '약한 비')

export const getWeatherPresentation = (weather = {}) => {
  const status = WEATHER_GROUP_LABELS[weather.main] ?? normalizeProviderDescription(weather.main)
  const providerDescription = normalizeProviderDescription(weather.description)
  const description = WEATHER_CODE_DESCRIPTIONS[weather.id] ?? providerDescription

  return {
    status: status || '날씨 정보 없음',
    description: description && description !== status ? description : '',
  }
}

export const getAirQualityGrade = (aqi) => {
  if (!Number.isFinite(aqi)) return '정보 없음'
  if (aqi <= 50) return '좋음'
  if (aqi <= 100) return '보통'
  if (aqi <= 150) return '나쁨'
  return '매우 나쁨'
}

export const getWeatherErrorMessage = (error) => {
  if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') return ''
  if (error?.response?.status === 401) {
    return 'OpenWeather API Key가 유효하지 않습니다. 환경변수를 확인해 주세요.'
  }
  if (error?.response?.status === 404) return '날씨 정보를 찾을 수 없는 도시입니다.'
  if (error?.response?.status === 429) {
    return 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'
  }
  if (error?.code === 'ECONNABORTED') return 'API 요청 시간이 초과됐습니다.'
  if (error?.request || error instanceof TypeError) {
    return '네트워크 연결을 확인하고 다시 시도해 주세요.'
  }
  return error?.message || '날씨 정보를 불러오지 못했습니다.'
}

export const normalizeCurrentWeather = (city, response) => {
  const current = response?.data
  if (!Number.isFinite(current?.main?.temp)) {
    throw new Error('현재 날씨 응답에 필요한 온도 데이터가 없습니다.')
  }

  const weather = current.weather?.[0] ?? {}
  const presentation = getWeatherPresentation(weather)

  return {
    id: city.id,
    nameKo: city.nameKo,
    nameEn: city.nameEn,
    regionKo: city.regionKo,
    latitude: city.latitude,
    longitude: city.longitude,
    temperature: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like ?? current.main.temp),
    humidity: current.main.humidity ?? null,
    windSpeed: current.wind?.speed ?? null,
    precipitation: current.rain?.['1h'] ?? current.snow?.['1h'] ?? 0,
    weatherCondition: weather.main ?? 'Unknown',
    status: presentation.status,
    description: presentation.description,
    observedAt: Number.isFinite(current.dt)
      ? new Date(current.dt * 1000).toISOString()
      : new Date().toISOString(),
  }
}

export const normalizeForecast = (city, response) => {
  const list = Array.isArray(response?.data?.list) ? response.data.list : []
  return list.map((item, index) => {
    const weather = item.weather?.[0] ?? {}
    const presentation = getWeatherPresentation(weather)

    return {
      id: `${city.id}-${item.dt ?? index}`,
      dateTime: Number.isFinite(item.dt)
        ? new Date(item.dt * 1000).toISOString()
        : (item.dt_txt ?? new Date(0).toISOString()),
      temperature: Math.round(item.main?.temp ?? 0),
      humidity: item.main?.humidity ?? null,
      windSpeed: item.wind?.speed ?? null,
      precipitation: item.rain?.['3h'] ?? item.snow?.['3h'] ?? 0,
      status: presentation.description || presentation.status,
      weatherCondition: weather.main ?? 'Unknown',
      precipitationProbability: Math.round((item.pop ?? 0) * 100),
    }
  })
}

export const normalizeAirQuality = (response) => {
  const current = response?.data?.current
  const usAqi = Number(current?.us_aqi)
  const pm25 = Number(current?.pm2_5)

  if (!Number.isFinite(usAqi)) return null
  return {
    usAqi: Math.round(usAqi),
    pm25: Number.isFinite(pm25) ? Math.round(pm25) : null,
    grade: getAirQualityGrade(usAqi),
  }
}

export const fetchWeatherSnapshot = async (
  city,
  {
    signal,
    apiKey = getOpenWeatherApiKey(),
    apiProviders = providers,
    useDemoWhenKeyMissing = true,
    includeForecast = true,
  } = {},
) => {
  if (!city) throw new Error('요청한 도시를 찾을 수 없습니다.')

  if (!hasOpenWeatherApiKey(apiKey)) {
    if (useDemoWhenKeyMissing) return createDemoWeatherSnapshot(city)
    throw new Error('OpenWeather API 사용을 위해 환경변수 설정이 필요합니다.')
  }

  const [currentResult, forecastResult, airQualityResult] = await Promise.allSettled([
    apiProviders.getCurrentWeather(city.latitude, city.longitude, { signal, apiKey }),
    includeForecast
      ? apiProviders.getWeatherForecast(city.latitude, city.longitude, { signal, apiKey })
      : Promise.resolve(null),
    apiProviders.getAirQuality(city.latitude, city.longitude, { signal }),
  ])

  if (signal?.aborted) throw new axios.CanceledError('요청이 취소됐습니다.')
  if (currentResult.status === 'rejected') throw currentResult.reason

  const currentWeather = normalizeCurrentWeather(city, currentResult.value)
  const warningMessages = []
  let forecast = []
  let airQuality = null

  if (includeForecast) {
    if (forecastResult.status === 'fulfilled') {
      forecast = normalizeForecast(city, forecastResult.value)
      if (!forecast.length) warningMessages.push('단기 예보 데이터가 없습니다.')
    } else {
      warningMessages.push('단기 예보를 불러오지 못했습니다.')
    }
  }

  if (airQualityResult.status === 'fulfilled') {
    airQuality = normalizeAirQuality(airQualityResult.value)
    if (!airQuality) warningMessages.push('대기질 데이터가 없습니다.')
  } else {
    warningMessages.push('대기질을 불러오지 못했습니다.')
  }

  return {
    ...currentWeather,
    forecast,
    airQuality,
    dataSource: 'live',
    requiresApiKey: false,
    warningMessages,
    lastUpdatedAt: new Date().toISOString(),
  }
}

export const fetchWeatherList = async (cityList, options = {}) => {
  const results = await Promise.allSettled(
    cityList.map((city) => fetchWeatherSnapshot(city, { ...options, includeForecast: false })),
  )
  const weatherList = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)

  if (weatherList.length === 0) {
    const firstError = results.find((result) => result.status === 'rejected')?.reason
    throw firstError ?? new Error('날씨 정보를 불러오지 못했습니다.')
  }

  return {
    weatherList,
    failedCount: results.length - weatherList.length,
    dataSource: weatherList.some((city) => city.dataSource === 'live') ? 'live' : 'demo',
    requiresApiKey: weatherList.every((city) => city.requiresApiKey),
    lastUpdatedAt: new Date().toISOString(),
  }
}
