import test from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useConfigStore } from '../src/stores/configStore.js'

test('온도 단위를 변경하고 localStorage에 저장한다', () => {
  const storage = new Map()
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }

  setActivePinia(createPinia())
  const store = useConfigStore()

  assert.equal(store.unit, 'celsius')
  assert.equal(store.unitSymbol, '℃')

  store.toggleUnit()

  assert.equal(store.unit, 'fahrenheit')
  assert.equal(store.unitSymbol, '℉')
  assert.equal(storage.get('weatherfit-unit'), 'fahrenheit')

  delete globalThis.localStorage
})

test('저장된 온도 단위를 새 Store에서 불러온다', () => {
  globalThis.localStorage = {
    getItem: () => 'fahrenheit',
    setItem: () => {},
  }

  setActivePinia(createPinia())
  const store = useConfigStore()

  assert.equal(store.unit, 'fahrenheit')

  delete globalThis.localStorage
})
