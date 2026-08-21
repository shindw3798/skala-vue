<script setup>
import { onMounted, ref } from 'vue'
import PracticeCityItem from './PracticeCityItem.vue'
import PracticePanel from './PracticePanel.vue'

const selectedCityId = ref('seoul')
const detailMessage = ref('도시를 선택해 주세요.')
const lifecycleStatus = ref('컴포넌트를 준비하고 있습니다.')

const cities = [
  { id: 'seoul', name: '서울', summary: '퇴근 뒤 산책하기 좋은지 확인' },
  { id: 'busan', name: '부산', summary: '해안가 자전거 날씨 확인' },
]

const openDetail = (cityId) => {
  const city = cities.find((item) => item.id === cityId)
  detailMessage.value = city ? `${city.name} 상세 정보를 확인했습니다.` : '도시를 찾지 못했습니다.'
}

onMounted(() => {
  lifecycleStatus.value = '컴포넌트가 화면에 연결됐습니다.'
})
</script>

<template>
  <PracticePanel>
    <template #title>
      <h2>도시 컴포넌트 연습</h2>
    </template>

    <ul class="city-list">
      <PracticeCityItem
        v-for="city in cities"
        :key="city.id"
        :city="city"
        :selected="selectedCityId === city.id"
        @select-city="selectedCityId = $event"
        @open-detail="openDetail"
      />
    </ul>

    <p>{{ detailMessage }}</p>

    <template #footer>{{ lifecycleStatus }}</template>
  </PracticePanel>
</template>

<style scoped>
.city-list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0 0 16px;
  list-style: none;
}

h2,
p {
  margin: 0;
}
</style>
