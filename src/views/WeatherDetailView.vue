<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import AirQualityBadge from '@/components/exercise/AirQualityBadge.vue'
import ForecastList from '@/components/exercise/ForecastList.vue'
import ActivityScoreCard from '@/components/exercise/ActivityScoreCard.vue'
import WeatherLoadingSkeleton from '@/components/exercise/WeatherLoadingSkeleton.vue'
import { calculateActivityScore, activityOptions } from '@/composables/useActivityScore'
import { convertTemperature, useTemperature } from '@/composables/useTemperature'
import { useWeatherData } from '@/composables/useWeatherData'
import { getCityById } from '@/data/cities'
import { useConfigStore } from '@/stores/configStore'
import { usePreferenceStore } from '@/stores/preferenceStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()
const { selectedActivity } = storeToRefs(preferenceStore)
const invalidCity = ref(false)

const {
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
} = useWeatherData()

const { displayTemperature, unitSymbol } = useTemperature(
  computed(() => currentWeather.value?.temperature ?? 0),
)

const activityLabel = computed(
  () => activityOptions.find((item) => item.value === selectedActivity.value)?.label ?? '러닝',
)
const insight = computed(() => {
  if (!currentWeather.value) return null
  return calculateActivityScore({
    activityType: selectedActivity.value,
    temperature: currentWeather.value.temperature,
    humidity: currentWeather.value.humidity,
    windSpeed: currentWeather.value.windSpeed,
    weatherCondition: currentWeather.value.weatherCondition,
    precipitation: currentWeather.value.precipitation,
    airQualityIndex: airQuality.value?.usAqi,
  })
})

const loadCity = async () => {
  const city = getCityById(String(route.params.cityId ?? ''))
  invalidCity.value = !city
  const loaded = await loadCityWeather(city)
  if (loaded) preferenceStore.setLastCity(city.id)
}

const formatUpdatedAt = (value) =>
  value
    ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'short', timeStyle: 'short' }).format(
        new Date(value),
      )
    : ''

watch(() => route.params.cityId, loadCity, { immediate: true })
</script>

<template>
  <main class="detail-view">
    <el-button @click="router.push('/')">← 대시보드로</el-button>

    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false">
      <template #default>
        <el-button v-if="invalidCity" type="primary" plain @click="router.replace('/')">
          대시보드로 안전하게 이동
        </el-button>
        <el-button v-else type="danger" plain @click="loadCity">다시 시도</el-button>
      </template>
    </el-alert>

    <el-alert
      v-if="requiresApiKey"
      title="환경변수 설정이 필요합니다. 현재 데모 데이터를 표시합니다."
      type="warning"
      show-icon
      :closable="false"
    />

    <el-alert
      v-for="warning in warningMessages"
      :key="warning"
      :title="warning"
      type="warning"
      show-icon
      :closable="false"
    />

    <WeatherLoadingSkeleton
      v-if="isLoading"
      :count="2"
      label="상세 날씨와 예보를 불러오는 중입니다."
    />

    <template v-else-if="currentWeather">
      <section class="detail-hero">
        <div>
          <p>{{ currentWeather.regionKo }}</p>
          <h1>{{ currentWeather.nameKo }}</h1>
          <span>
            {{ currentWeather.status
            }}<template v-if="currentWeather.description">
              · {{ currentWeather.description }}</template
            >
          </span>
          <small>
            {{ dataSource === 'live' ? '실시간 API' : '데모 데이터' }} ·
            {{ formatUpdatedAt(lastUpdatedAt) }}
          </small>
        </div>
        <div class="detail-hero__temp">
          {{ displayTemperature }}<small>{{ unitSymbol }}</small>
        </div>
        <AirQualityBadge :air-quality="airQuality" />
      </section>

      <section class="metric-grid" aria-label="상세 기상 관측값">
        <el-card shadow="never">
          <span>체감 온도</span>
          <strong>
            {{ convertTemperature(currentWeather.feelsLike, configStore.unit)
            }}{{ configStore.unitSymbol }}
          </strong>
        </el-card>
        <el-card shadow="never"
          ><span>습도</span><strong>{{ currentWeather.humidity ?? '-' }}%</strong></el-card
        >
        <el-card shadow="never"
          ><span>풍속</span><strong>{{ currentWeather.windSpeed ?? '-' }}m/s</strong></el-card
        >
        <el-card shadow="never"
          ><span>강수</span><strong>{{ currentWeather.precipitation }}mm</strong></el-card
        >
      </section>

      <BaseDashboardCard>
        <template #header
          ><h2>오늘의 {{ activityLabel }} 인사이트</h2></template
        >
        <ActivityScoreCard v-if="insight" :insight="insight" :activity-label="activityLabel" />
      </BaseDashboardCard>

      <BaseDashboardCard>
        <template #header><h2>3시간 단위 단기 예보</h2></template>
        <ForecastList :forecast="forecast" />
      </BaseDashboardCard>
    </template>

    <el-empty
      v-else-if="!isLoading && !errorMessage"
      description="표시할 도시 데이터가 없습니다."
    />
  </main>
</template>

<style scoped>
.detail-view {
  display: grid;
  gap: 1.25rem;
  min-height: 360px;
  min-width: 0;
}

.detail-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem 2rem;
  align-items: center;
  padding: clamp(1.5rem, 5vw, 3rem);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #163e49, #1c7273);
  color: #fff;
}

.detail-hero > * {
  min-width: 0;
}

.detail-hero p,
.detail-hero h1 {
  margin: 0;
}

.detail-hero p,
.detail-hero span {
  color: rgba(255, 255, 255, 0.72);
}

.detail-hero h1 {
  font-size: clamp(2.4rem, 7vw, 5rem);
}

.detail-hero__temp {
  grid-row: span 2;
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 800;
  line-height: 1;
}

.detail-hero__temp small {
  font-size: 1.5rem;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.metric-grid span,
.metric-grid strong {
  display: block;
}

.metric-grid span {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.metric-grid strong {
  margin-top: 0.3rem;
  color: var(--color-heading);
  font-size: 1.2rem;
}

h2 {
  margin: 0;
}

@media (max-width: 700px) {
  .detail-hero,
  .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 440px) {
  .detail-hero {
    grid-template-columns: 1fr;
    padding: 1.25rem;
  }

  .detail-hero__temp {
    grid-row: auto;
    font-size: 3.5rem;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
