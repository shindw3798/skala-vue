<script setup>
import { computed } from 'vue'
import { convertTemperature } from '@/composables/useTemperature'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  recommendation: {
    type: Object,
    required: true,
  },
  activityLabel: {
    type: String,
    required: true,
  },
})

const configStore = useConfigStore()
const forecast = computed(() => props.recommendation.forecast)
const insight = computed(() => props.recommendation.insight)
const progressColor = computed(() => {
  if (insight.value.score >= 85) return '#168574'
  if (insight.value.score >= 70) return '#2878b5'
  if (insight.value.score >= 50) return '#a96200'
  return '#c63c3c'
})
const tagType = computed(() => {
  if (insight.value.score >= 85) return 'success'
  if (insight.value.score >= 70) return 'primary'
  if (insight.value.score >= 50) return 'warning'
  return 'danger'
})

const formatDateTime = (value) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
</script>

<template>
  <el-card class="best-time-card" shadow="never">
    <div class="best-time-card__heading">
      <div>
        <p class="eyebrow">예보 비교 결과</p>
        <h2>{{ activityLabel }} 추천 시간</h2>
      </div>
      <el-tag :type="tagType" effect="dark">{{ insight.grade }} · {{ insight.score }}점</el-tag>
    </div>

    <div class="best-time-card__content">
      <div class="best-time-card__time">
        <span>표시된 단기 예보 중 가장 좋은 시간</span>
        <time :datetime="forecast.dateTime">{{ formatDateTime(forecast.dateTime) }}</time>
      </div>
      <dl>
        <div>
          <dt>예상 기온</dt>
          <dd>
            {{ convertTemperature(forecast.temperature, configStore.unit)
            }}{{ configStore.unitSymbol }}
          </dd>
        </div>
        <div>
          <dt>날씨</dt>
          <dd>{{ forecast.status }}</dd>
        </div>
        <div>
          <dt>강수 확률</dt>
          <dd>{{ forecast.precipitationProbability }}%</dd>
        </div>
      </dl>
    </div>

    <el-progress
      :percentage="insight.score"
      :stroke-width="12"
      :color="progressColor"
      :aria-label="`${activityLabel} 추천 시간 적합도 ${insight.score}점`"
    />
    <p class="best-time-card__note">
      표시된 예보를 같은 활동 기준으로 계산한 결과입니다.
      <template v-if="recommendation.airQualityApplied">
        대기질은 현재 측정된 AQI를 기준으로 계산했습니다.
      </template>
      <template v-else> 대기질 정보는 점수에 반영되지 않았습니다. </template>
    </p>
  </el-card>
</template>

<style scoped>
.best-time-card {
  border-color: #9acfc4;
  border-radius: var(--radius-large);
  background:
    radial-gradient(circle at 92% 8%, rgba(150, 222, 207, 0.45), transparent 30%),
    var(--color-surface);
}

.best-time-card__heading,
.best-time-card__content,
dl {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.eyebrow {
  margin: 0;
  color: var(--color-primary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h2 {
  margin: 0.25rem 0 0;
  color: var(--color-heading);
}

.best-time-card__content {
  margin: 1.25rem 0;
  align-items: end;
}

.best-time-card__time {
  display: grid;
  gap: 0.25rem;
}

.best-time-card__time span,
dt,
.best-time-card__note {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

time {
  color: var(--color-heading);
  font-size: clamp(1.35rem, 4vw, 2.1rem);
  font-weight: 850;
}

dl {
  flex-wrap: wrap;
  margin: 0;
}

dl div {
  min-width: 90px;
}

dt,
dd {
  margin: 0;
}

dd {
  margin-top: 0.2rem;
  color: var(--color-heading);
  font-weight: 750;
}

.best-time-card__note {
  margin: 0.85rem 0 0;
  line-height: 1.6;
}

@media (max-width: 700px) {
  .best-time-card__heading,
  .best-time-card__content {
    align-items: flex-start;
    flex-direction: column;
  }

  dl {
    width: 100%;
  }
}
</style>
