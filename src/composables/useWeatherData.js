import { getCurrentScope, onScopeDispose, ref } from 'vue'
import axios from 'axios'
import { fetchWeatherSnapshot, getWeatherErrorMessage } from '../services/weatherService.js'

export const useWeatherData = ({ fetcher = fetchWeatherSnapshot, fetchOptions = {} } = {}) => {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const currentWeather = ref(null)
  const forecast = ref([])
  const airQuality = ref(null)
  const lastUpdatedAt = ref(null)
  const dataSource = ref(null)
  const requiresApiKey = ref(false)
  const warningMessages = ref([])

  let activeRequestId = 0
  let activeController = null

  const resetData = () => {
    currentWeather.value = null
    forecast.value = []
    airQuality.value = null
    lastUpdatedAt.value = null
    dataSource.value = null
    requiresApiKey.value = false
    warningMessages.value = []
  }

  const cancel = () => {
    activeRequestId += 1
    activeController?.abort()
    activeController = null
    isLoading.value = false
  }

  const loadCityWeather = async (city) => {
    const requestId = ++activeRequestId
    activeController?.abort()
    activeController = new AbortController()
    resetData()
    errorMessage.value = ''

    if (!city) {
      errorMessage.value = '요청한 도시를 찾을 수 없습니다.'
      return false
    }

    isLoading.value = true
    try {
      const snapshot = await fetcher(city, {
        ...fetchOptions,
        signal: activeController.signal,
      })
      if (requestId !== activeRequestId) return false

      currentWeather.value = {
        id: snapshot.id,
        nameKo: snapshot.nameKo,
        nameEn: snapshot.nameEn,
        regionKo: snapshot.regionKo,
        latitude: snapshot.latitude,
        longitude: snapshot.longitude,
        temperature: snapshot.temperature,
        feelsLike: snapshot.feelsLike,
        humidity: snapshot.humidity,
        windSpeed: snapshot.windSpeed,
        precipitation: snapshot.precipitation,
        weatherCondition: snapshot.weatherCondition,
        status: snapshot.status,
        description: snapshot.description,
        observedAt: snapshot.observedAt,
      }
      forecast.value = snapshot.forecast
      airQuality.value = snapshot.airQuality
      lastUpdatedAt.value = snapshot.lastUpdatedAt
      dataSource.value = snapshot.dataSource
      requiresApiKey.value = snapshot.requiresApiKey
      warningMessages.value = snapshot.warningMessages
      return true
    } catch (error) {
      if (requestId !== activeRequestId || axios.isCancel(error)) return false
      errorMessage.value = getWeatherErrorMessage(error)
      return false
    } finally {
      if (requestId === activeRequestId) {
        isLoading.value = false
        activeController = null
      }
    }
  }

  if (getCurrentScope()) onScopeDispose(cancel)

  return {
    isLoading,
    errorMessage,
    currentWeather,
    forecast,
    airQuality,
    lastUpdatedAt,
    dataSource,
    requiresApiKey,
    warningMessages,
    loadCityWeather,
    resetData,
    cancel,
  }
}
