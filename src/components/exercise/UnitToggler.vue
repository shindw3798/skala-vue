<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button
    class="unit-toggler"
    type="button"
    :aria-label="`현재 ${configStore.unitLabel}, 클릭하여 단위 변경`"
    @click="configStore.toggleUnit"
  >
    <span :class="{ active: configStore.unit === 'celsius' }">℃</span>
    <span aria-hidden="true">/</span>
    <span :class="{ active: configStore.unit === 'fahrenheit' }">℉</span>
  </button>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  gap: 0.3rem;
  align-items: center;
  padding: 0.48rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-raised);
  color: var(--color-text-muted);
  cursor: pointer;
}

.unit-toggler .active {
  color: var(--color-primary);
  font-weight: 800;
}

.unit-toggler:hover,
.unit-toggler:focus-visible {
  border-color: var(--color-primary);
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.unit-toggler:active {
  transform: translateY(1px);
}
</style>
