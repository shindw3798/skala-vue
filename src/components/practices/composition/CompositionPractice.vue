<script setup>
import { computed, reactive, ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const selectedCityId = ref('seoul')
const searchStatus = ref('전체 도시를 표시하고 있습니다.')
const selectedStatus = ref('서울을 선택했습니다.')

const weatherList = reactive([
  { id: 'seoul', name: '서울', temperature: 27 },
  { id: 'busan', name: '부산', temperature: 25 },
  { id: 'jeju', name: '제주', temperature: 24 },
])

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim().toLocaleLowerCase('ko-KR')
  if (!keyword) return weatherList

  return weatherList.filter((city) => city.name.toLocaleLowerCase('ko-KR').includes(keyword))
})

watch(selectedCityId, (cityId) => {
  const city = weatherList.find((item) => item.id === cityId)
  selectedStatus.value = city ? `선택한 도시: ${city.name}` : '선택한 도시가 없습니다.'
})

watchEffect(() => {
  const keyword = searchQuery.value.trim()
  searchStatus.value = keyword
    ? `'${keyword}' 검색 결과 ${filteredWeatherList.value.length}건`
    : '전체 도시를 표시하고 있습니다.'
})
</script>

<template>
  <section class="composition-practice" aria-labelledby="composition-title">
    <h2 id="composition-title">Composition API 복습</h2>

    <label for="practice-city-search">도시 검색</label>
    <input
      id="practice-city-search"
      v-model.trim="searchQuery"
      type="search"
      placeholder="도시 이름을 입력하세요"
    />

    <p class="status">{{ searchStatus }}</p>
    <p class="status">{{ selectedStatus }}</p>

    <ul v-if="filteredWeatherList.length" class="city-list">
      <li v-for="city in filteredWeatherList" :key="city.id">
        <button
          type="button"
          :class="{ selected: selectedCityId === city.id }"
          @click="selectedCityId = city.id"
        >
          <strong>{{ city.name }}</strong>
          <span>{{ city.temperature }}℃</span>
        </button>
      </li>
    </ul>
    <p v-else class="empty">검색 결과와 일치하는 도시가 없습니다.</p>
  </section>
</template>

<style scoped>
.composition-practice {
  width: min(100%, 680px);
  margin: 0 auto;
  padding: 24px;
  color: #243247;
  background: #f7f9fc;
  border: 1px solid #d9e1ec;
  border-radius: 16px;
}

label {
  display: block;
  margin: 20px 0 8px;
  font-weight: 700;
}

input {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #9aa9bc;
  border-radius: 8px;
}

input:focus-visible,
button:focus-visible {
  outline: 3px solid #8db8f2;
  outline-offset: 2px;
}

.status {
  margin: 12px 0 0;
  color: #52637a;
}

.city-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding: 0;
  margin: 20px 0 0;
  list-style: none;
}

.city-list button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 14px;
  color: inherit;
  background: #fff;
  border: 1px solid #c8d3e0;
  border-radius: 10px;
  cursor: pointer;
}

.city-list button.selected {
  background: #e7f0ff;
  border-color: #2768bd;
}

.empty {
  padding: 24px 0 8px;
  text-align: center;
}
</style>
