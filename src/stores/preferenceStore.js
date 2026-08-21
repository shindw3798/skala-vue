import { defineStore } from 'pinia'

const STORAGE_KEY = 'weatherfit-preferences'
const DEFAULT_ACTIVITY = 'running'
const AVAILABLE_ACTIVITIES = new Set(['running', 'walking', 'cycling'])
const MAX_RECENT_SEARCHES = 5

const normalizeStringList = (value) =>
  Array.isArray(value)
    ? [...new Set(value.filter((item) => typeof item === 'string' && item.trim()))]
    : []

const loadPreferences = () => {
  if (typeof localStorage === 'undefined') return {}

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export const usePreferenceStore = defineStore('preferences', {
  state: () => {
    const saved = loadPreferences()
    return {
      selectedActivity: AVAILABLE_ACTIVITIES.has(saved.selectedActivity)
        ? saved.selectedActivity
        : DEFAULT_ACTIVITY,
      favoriteCityIds: normalizeStringList(saved.favoriteCityIds),
      recentSearches: normalizeStringList(saved.recentSearches).slice(0, MAX_RECENT_SEARCHES),
      lastCityId: typeof saved.lastCityId === 'string' ? saved.lastCityId : 'seoul',
    }
  },
  getters: {
    favoriteCount: (state) => state.favoriteCityIds.length,
    isFavorite: (state) => (cityId) => state.favoriteCityIds.includes(cityId),
  },
  actions: {
    persist() {
      if (typeof localStorage === 'undefined') return

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            selectedActivity: this.selectedActivity,
            favoriteCityIds: this.favoriteCityIds,
            recentSearches: this.recentSearches,
            lastCityId: this.lastCityId,
          }),
        )
      } catch (error) {
        console.warn('[WeatherFit] 환경설정을 localStorage에 저장하지 못했습니다.', error)
      }
    },
    setActivity(activity) {
      if (!AVAILABLE_ACTIVITIES.has(activity)) return
      this.selectedActivity = activity
      this.persist()
    },
    toggleFavorite(cityId) {
      if (typeof cityId !== 'string' || !cityId) return
      this.favoriteCityIds = this.isFavorite(cityId)
        ? this.favoriteCityIds.filter((id) => id !== cityId)
        : [...this.favoriteCityIds, cityId]
      this.persist()
    },
    addRecentSearch(query) {
      const normalizedQuery = String(query ?? '').trim()
      if (!normalizedQuery) return

      this.recentSearches = [
        normalizedQuery,
        ...this.recentSearches.filter(
          (item) => item.toLocaleLowerCase('ko-KR') !== normalizedQuery.toLocaleLowerCase('ko-KR'),
        ),
      ].slice(0, MAX_RECENT_SEARCHES)
      this.persist()
    },
    clearRecentSearches() {
      this.recentSearches = []
      this.persist()
    },
    setLastCity(cityId) {
      if (typeof cityId !== 'string' || !cityId) return
      this.lastCityId = cityId
      this.persist()
    },
  },
})
