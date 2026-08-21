import test from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { usePreferenceStore } from '../src/stores/preferenceStore.js'

test('최근 검색어를 중복 없이 저장하고 전체 삭제한다', () => {
  const storage = new Map()
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }

  setActivePinia(createPinia())
  const store = usePreferenceStore()
  store.addRecentSearch('서울')
  store.addRecentSearch('부산')
  store.addRecentSearch('서울')

  assert.deepEqual(store.recentSearches, ['서울', '부산'])
  assert.deepEqual(JSON.parse(storage.get('weatherfit-preferences')).recentSearches, [
    '서울',
    '부산',
  ])

  store.clearRecentSearches()
  assert.deepEqual(store.recentSearches, [])
  assert.deepEqual(JSON.parse(storage.get('weatherfit-preferences')).recentSearches, [])

  delete globalThis.localStorage
})
