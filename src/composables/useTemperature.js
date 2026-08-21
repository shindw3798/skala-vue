import { computed, unref } from 'vue'
import { useConfigStore } from '@/stores/configStore'

export const convertTemperature = (celsius, unit) =>
  unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)

export const useTemperature = (temperature) => {
  const configStore = useConfigStore()
  const displayTemperature = computed(() =>
    convertTemperature(Number(unref(temperature) ?? 0), configStore.unit),
  )

  return { displayTemperature, unitSymbol: computed(() => configStore.unitSymbol) }
}
