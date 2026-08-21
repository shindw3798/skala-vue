<script setup>
import { useConfigStore } from '@/stores/configStore'
import { convertTemperature } from '@/composables/useTemperature'

defineProps({
  forecast: {
    type: Array,
    default: () => [],
  },
})

const configStore = useConfigStore()

const formatTime = (value) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
  }).format(new Date(value))
</script>

<template>
  <div v-if="forecast.length" class="forecast-list">
    <el-card v-for="item in forecast" :key="item.id" class="forecast-item" shadow="never">
      <div class="forecast-item__content">
        <time :datetime="item.dateTime">{{ formatTime(item.dateTime) }}</time>
        <strong
          >{{ convertTemperature(item.temperature, configStore.unit)
          }}{{ configStore.unitSymbol }}</strong
        >
        <span>{{ item.status }}</span>
        <small>강수 {{ item.precipitationProbability }}%</small>
      </div>
    </el-card>
  </div>
  <el-empty v-else description="표시할 단기 예보가 없습니다." :image-size="80" />
</template>

<style scoped>
.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.75rem;
}

.forecast-item {
  min-width: 0;
  border-color: var(--color-border);
  border-radius: var(--radius-medium);
  background: var(--color-surface-raised);
}

.forecast-item__content {
  display: grid;
  gap: 0.25rem;
}

time,
small {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

strong {
  color: var(--color-heading);
  font-size: 1.35rem;
}
</style>
