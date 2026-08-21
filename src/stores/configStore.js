import { defineStore } from 'pinia'

const STORAGE_KEY = 'weatherfit-unit'
const DEFAULT_UNIT = 'celsius'
const AVAILABLE_UNITS = new Set(['celsius', 'fahrenheit'])

const loadUnit = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_UNIT

  try {
    const savedUnit = localStorage.getItem(STORAGE_KEY)
    return AVAILABLE_UNITS.has(savedUnit) ? savedUnit : DEFAULT_UNIT
  } catch {
    return DEFAULT_UNIT
  }
}

const saveUnit = (unit) => {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, unit)
  } catch {
    // 저장이 막힌 환경에서도 현재 탭의 단위 변경은 그대로 사용한다.
  }
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: loadUnit(),
    lastUpdatedAt: null,
  }),
  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
    unitLabel: (state) => (state.unit === 'celsius' ? '섭씨' : '화씨'),
  },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
      saveUnit(this.unit)
    },
    markUpdated() {
      this.lastUpdatedAt = new Date().toISOString()
    },
  },
})
