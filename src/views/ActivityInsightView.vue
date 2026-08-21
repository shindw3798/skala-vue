<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import ActivitySelector from '@/components/exercise/ActivitySelector.vue'
import ActivityScoreCard from '@/components/exercise/ActivityScoreCard.vue'
import AirQualityBadge from '@/components/exercise/AirQualityBadge.vue'
import ForecastList from '@/components/exercise/ForecastList.vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import BestActivityTimeCard from '@/components/exercise/BestActivityTimeCard.vue'
import WeatherLoadingSkeleton from '@/components/exercise/WeatherLoadingSkeleton.vue'
import {
  activityOptions,
  calculateActivityScore,
  findBestActivityForecast,
} from '@/composables/useActivityScore'
import { convertTemperature } from '@/composables/useTemperature'
import { useWeatherData } from '@/composables/useWeatherData'
import { cities, getCityById } from '@/data/cities'
import { useConfigStore } from '@/stores/configStore'
import { usePreferenceStore } from '@/stores/preferenceStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()
const { selectedActivity } = storeToRefs(preferenceStore)
const invalidCity = ref(false)
const routeCityId = computed(() => String(route.params.cityId ?? ''))
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
const bestActivityTime = computed(() =>
  findBestActivityForecast({
    forecast: forecast.value,
    activityType: selectedActivity.value,
    airQualityIndex: airQuality.value?.usAqi,
  }),
)

const updateActivity = (activity) => preferenceStore.setActivity(activity)
const updateCity = (cityId) => {
  preferenceStore.setLastCity(cityId)
  router.push({ name: 'activity-insight', params: { cityId } })
}

const loadInsight = async (cityId) => {
  const city = getCityById(cityId)
  invalidCity.value = !city
  const loaded = await loadCityWeather(city)
  if (loaded) preferenceStore.setLastCity(city.id)
}

const formatUpdatedAt = (value) =>
  value
    ? new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(value))
    : ''

watch(routeCityId, loadInsight, { immediate: true })
</script>

<template>
  <main class="insight-view">
    <section class="insight-heading">
      <p class="eyebrow">활동 적합도</p>
      <h1>오늘 야외 활동을 해도 괜찮을까요?</h1>
      <p>기온, 습도, 바람, 강수와 대기질을 이용해 선택한 활동의 점수를 계산합니다.</p>
    </section>

    <BaseDashboardCard>
      <template #header><h2>조건 선택</h2></template>
      <div class="controls">
        <div>
          <label for="city-select">도시</label>
          <el-select
            id="city-select"
            :model-value="routeCityId"
            aria-label="활동 도시 선택"
            @change="updateCity"
          >
            <el-option
              v-for="city in cities"
              :key="city.id"
              :label="city.nameKo"
              :value="city.id"
            />
          </el-select>
        </div>
        <ActivitySelector :model-value="selectedActivity" @update:model-value="updateActivity" />
      </div>
    </BaseDashboardCard>

    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false">
      <template #default>
        <el-button v-if="invalidCity" type="primary" plain @click="router.replace('/')">
          대시보드로 안전하게 이동
        </el-button>
        <el-button v-else type="danger" plain @click="loadInsight(routeCityId)">
          다시 시도
        </el-button>
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

    <div class="insight-content">
      <WeatherLoadingSkeleton
        v-if="isLoading"
        :count="2"
        label="날씨와 활동 적합도를 계산하는 중입니다."
      />
      <template v-else-if="currentWeather && insight">
        <div class="insight-meta">
          <div>
            <span>선택 도시</span><strong>{{ currentWeather.nameKo }}</strong>
          </div>
          <div>
            <span>현재 날씨</span
            ><strong>
              {{ currentWeather.status }} ·
              {{ convertTemperature(currentWeather.temperature, configStore.unit)
              }}{{ configStore.unitSymbol }}
            </strong>
          </div>
          <AirQualityBadge :air-quality="airQuality" />
          <div>
            <span>데이터 기준</span>
            <strong>
              {{ dataSource === 'live' ? '실시간 API' : '데모 데이터' }} ·
              {{ formatUpdatedAt(lastUpdatedAt) }}
            </strong>
          </div>
        </div>
        <BestActivityTimeCard
          v-if="bestActivityTime"
          :recommendation="bestActivityTime"
          :activity-label="activityLabel"
        />
        <ActivityScoreCard :insight="insight" :activity-label="activityLabel" />
        <BaseDashboardCard>
          <template #header><h2>활동 시간 참고용 단기 예보</h2></template>
          <ForecastList :forecast="forecast" />
        </BaseDashboardCard>
      </template>
      <el-empty
        v-else-if="!isLoading && !errorMessage"
        description="분석할 날씨 데이터가 없습니다."
      />
    </div>
  </main>
</template>

<style scoped>
.insight-view,
.insight-content {
  display: grid;
  gap: 1.25rem;
  min-width: 0;
}

.insight-heading {
  padding: clamp(1.5rem, 4vw, 3rem);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #f1f9f6, #d8f0e9);
}

.insight-heading h1 {
  max-width: 700px;
  margin: 0.4rem 0 0.7rem;
  color: var(--color-heading);
  font-size: clamp(2rem, 5vw, 3.8rem);
  line-height: 1.08;
}

.insight-heading p:last-child {
  max-width: 680px;
  margin: 0;
  color: var(--color-text-muted);
}

.eyebrow {
  margin: 0;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.controls > div {
  display: grid;
  gap: 0.5rem;
}

.controls > * {
  min-width: 0;
}

label {
  color: var(--color-heading);
  font-weight: 700;
}

.el-select {
  width: 100%;
}

.insight-content {
  min-height: 260px;
}

.insight-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  background: var(--color-surface);
}

.insight-meta div {
  display: grid;
  min-width: 150px;
}

.insight-meta span {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

h2 {
  margin: 0;
}

@media (max-width: 600px) {
  .controls {
    grid-template-columns: 1fr;
  }

  .insight-heading {
    padding: 1.25rem;
  }

  .insight-heading h1 {
    font-size: 2rem;
  }
}
</style>
