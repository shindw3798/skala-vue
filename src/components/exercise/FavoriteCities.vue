<script setup>
import { convertTemperature } from '@/composables/useTemperature'
import { useConfigStore } from '@/stores/configStore'

defineProps({
  cities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select-city'])
const configStore = useConfigStore()
</script>

<template>
  <section class="favorites" aria-labelledby="favorites-title">
    <div>
      <p class="eyebrow">내 도시</p>
      <h2 id="favorites-title">즐겨찾기</h2>
    </div>
    <div v-if="cities.length" class="favorites__list">
      <button
        v-for="city in cities"
        :key="city.id"
        type="button"
        @click="emit('select-city', city)"
      >
        <span>★ {{ city.nameKo }}</span>
        <strong>
          {{ convertTemperature(city.temperature, configStore.unit) }}{{ configStore.unitSymbol }}
        </strong>
      </button>
    </div>
    <p v-else class="favorites__empty">날씨 카드의 별을 눌러 즐겨찾는 도시를 추가해 보세요.</p>
  </section>
</template>

<style scoped>
.favorites {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  background: var(--color-surface);
}

h2,
p {
  margin: 0;
}

.eyebrow {
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.favorites__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

button {
  display: flex;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-raised);
  color: var(--color-text);
  cursor: pointer;
}

button:hover,
button:focus-visible {
  border-color: var(--color-primary);
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

button:active {
  transform: translateY(1px);
}

.favorites__empty {
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .favorites {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
