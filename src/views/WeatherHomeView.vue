<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import EmptyState from '@/components/exercise/EmptyState.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import RecentSearches from '@/components/exercise/RecentSearches.vue'
import StatusBar from '@/components/exercise/StatusBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import FavoriteCities from '@/components/exercise/FavoriteCities.vue'
import WeatherLoadingSkeleton from '@/components/exercise/WeatherLoadingSkeleton.vue'
import { convertTemperature } from '@/composables/useTemperature'
import { cities, createDemoWeatherSnapshot } from '@/data/cities'
import { fetchWeatherList, getWeatherErrorMessage } from '@/services/weatherService'
import { useConfigStore } from '@/stores/configStore'
import { usePreferenceStore } from '@/stores/preferenceStore'

const router = useRouter()
const configStore = useConfigStore()
const preferenceStore = usePreferenceStore()

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref(cities.map(createDemoWeatherSnapshot))
const isLoading = ref(false)
const errorMessage = ref('')
const dataSource = ref('demo')
const requiresApiKey = ref(true)
const lastUpdatedAt = ref(null)
let activeRequestId = 0
let activeController = null

const filteredWeatherList = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase('ko-KR')
  if (!normalizedQuery) return weatherList.value
  return weatherList.value.filter((city) =>
    `${city.nameKo} ${city.nameEn} ${city.regionKo}`
      .toLocaleLowerCase('ko-KR')
      .includes(normalizedQuery),
  )
})

const averageTemperature = computed(() => {
  if (!weatherList.value.length) return 0
  const total = weatherList.value.reduce((sum, city) => sum + city.temperature, 0)
  return Math.round(total / weatherList.value.length)
})

const displayAverageTemperature = computed(() =>
  convertTemperature(averageTemperature.value, configStore.unit),
)

const favoriteCities = computed(() =>
  weatherList.value.filter((city) => preferenceStore.isFavorite(city.id)),
)

watch(selectedCityInfo, (city) => {
  if (city) console.info(`[WeatherFit][상태바] 선택한 도시: ${city.nameKo}`)
})

// 교재 과제에 맞춰 검색어 변화를 확인하며, 개발 환경에서만 출력한다.
watchEffect(() => {
  const currentQuery = searchQuery.value
  if (import.meta.env.DEV) {
    console.info(`[WeatherFit] 도시 검색어: ${currentQuery || '(없음)'}`)
  }
})

const loadWeather = async () => {
  const requestId = ++activeRequestId
  activeController?.abort()
  activeController = new AbortController()
  isLoading.value = true
  errorMessage.value = ''
  weatherList.value = []
  selectedCityInfo.value = null
  try {
    const result = await fetchWeatherList(cities, { signal: activeController.signal })
    if (requestId !== activeRequestId) return
    weatherList.value = result.weatherList
    dataSource.value = result.dataSource
    requiresApiKey.value = result.requiresApiKey
    lastUpdatedAt.value = result.lastUpdatedAt
    configStore.markUpdated()
    if (result.failedCount) {
      ElMessage.warning(`${result.failedCount}개 도시의 데이터를 불러오지 못했습니다.`)
    }
  } catch (error) {
    if (requestId !== activeRequestId) return
    errorMessage.value = getWeatherErrorMessage(error)
  } finally {
    if (requestId === activeRequestId) {
      isLoading.value = false
      activeController = null
    }
  }
}

const selectCity = (city) => {
  selectedCityInfo.value = city
  preferenceStore.setLastCity(city.id)
}

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

const saveRecentSearch = (query) => {
  preferenceStore.addRecentSearch(query)
}

const applyRecentSearch = (query) => {
  searchQuery.value = query
  preferenceStore.addRecentSearch(query)
}

const showDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}

const toggleFavorite = (cityId) => {
  preferenceStore.toggleFavorite(cityId)
  ElMessage.success(
    preferenceStore.isFavorite(cityId) ? '즐겨찾기에 추가했습니다.' : '즐겨찾기에서 해제했습니다.',
  )
}

onMounted(loadWeather)
onBeforeUnmount(() => {
  activeRequestId += 1
  activeController?.abort()
  activeController = null
})
</script>

<template>
  <main class="home-view">
    <section class="hero" aria-labelledby="home-title">
      <div>
        <p class="eyebrow">WeatherFit Insight</p>
        <h1 id="home-title">도시별 날씨와 야외 활동 정보</h1>
        <p>서울, 수원, 부산, 광주의 현재 날씨와 대기질을 비교할 수 있습니다.</p>
      </div>
      <div class="hero__summary" aria-label="날씨 요약">
        <span>도시 {{ weatherList.length }}곳</span>
        <strong>평균 {{ displayAverageTemperature }}{{ configStore.unitSymbol }}</strong>
        <el-tag :type="dataSource === 'live' ? 'success' : 'warning'">
          {{ dataSource === 'live' ? '실시간 API' : '데모 데이터' }}
        </el-tag>
        <small v-if="lastUpdatedAt"
          >갱신 {{ new Date(lastUpdatedAt).toLocaleTimeString('ko-KR') }}</small
        >
      </div>
    </section>

    <el-alert
      v-if="requiresApiKey && !errorMessage"
      title="환경변수 설정이 필요합니다. 현재 데모 데이터를 표시합니다."
      type="warning"
      show-icon
      :closable="false"
    />

    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false">
      <template #default>
        <el-button type="danger" plain @click="loadWeather">다시 시도</el-button>
      </template>
    </el-alert>

    <FavoriteCities :cities="favoriteCities" @select-city="selectCity" />

    <BaseDashboardCard>
      <template #header>
        <div class="dashboard-heading">
          <div>
            <p class="eyebrow">날씨 조회</p>
            <h2>도시별 날씨</h2>
          </div>
          <el-button :loading="isLoading" @click="loadWeather">새로고침</el-button>
        </div>
      </template>

      <div class="dashboard-content">
        <SearchBar
          :query="searchQuery"
          @update-query="updateSearchQuery"
          @submit-search="saveRecentSearch"
        />

        <RecentSearches
          :searches="preferenceStore.recentSearches"
          @select-search="applyRecentSearch"
          @clear-searches="preferenceStore.clearRecentSearches"
        />

        <StatusBar
          :selected-city="selectedCityInfo"
          :query="searchQuery"
          :result-count="filteredWeatherList.length"
          :total-count="weatherList.length"
        />

        <WeatherLoadingSkeleton
          v-if="isLoading"
          :count="4"
          label="도시별 날씨 카드를 불러오는 중입니다."
        />
        <div v-else-if="filteredWeatherList.length" class="weather-grid">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city-item="city"
            :selected="selectedCityInfo?.id === city.id"
            :favorite="preferenceStore.isFavorite(city.id)"
            @select-card="selectCity"
            @click-detail="showDetail"
            @toggle-favorite="toggleFavorite"
          />
        </div>
        <EmptyState v-else :query="searchQuery" />
      </div>
    </BaseDashboardCard>
  </main>
</template>

<style scoped>
.home-view {
  display: grid;
  gap: 1.25rem;
  min-width: 0;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: end;
  padding: clamp(1.5rem, 5vw, 3.5rem);
  border-radius: var(--radius-large);
  background:
    radial-gradient(circle at 80% 20%, rgba(150, 222, 207, 0.55), transparent 28%),
    linear-gradient(135deg, #123c45, #155d64);
  color: #eefcf8;
  box-shadow: var(--shadow-card);
}

.hero h1 {
  max-width: 760px;
  margin: 0.35rem 0 0.8rem;
  color: #fff;
  font-size: clamp(2rem, 5vw, 4.3rem);
  font-weight: 850;
  letter-spacing: -0.045em;
  line-height: 1.06;
}

.hero p {
  max-width: 620px;
  margin: 0;
  color: rgba(238, 252, 248, 0.76);
}

.eyebrow {
  margin: 0;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.hero .eyebrow {
  color: #8fe5d0;
}

.hero__summary {
  display: grid;
  gap: 0.3rem;
  min-width: 150px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-medium);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.hero__summary span {
  color: rgba(255, 255, 255, 0.7);
}

.hero__summary strong {
  font-size: 1.5rem;
}

.dashboard-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-heading h2 {
  margin: 0.2rem 0 0;
}

.dashboard-content {
  min-height: 240px;
  min-width: 0;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero__summary {
    min-width: 0;
  }

  .weather-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .hero {
    gap: 1.25rem;
    padding: 1.25rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .dashboard-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
