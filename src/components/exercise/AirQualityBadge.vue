<script setup>
import { computed } from 'vue'

const props = defineProps({
  airQuality: {
    type: Object,
    default: null,
  },
})

const hasAirQuality = computed(() => Number.isFinite(props.airQuality?.usAqi))
const airQualityGrade = computed(() => {
  if (!hasAirQuality.value) return '정보 없음'
  if (props.airQuality.grade) return props.airQuality.grade
  if (props.airQuality.usAqi <= 50) return '좋음'
  if (props.airQuality.usAqi <= 100) return '보통'
  if (props.airQuality.usAqi <= 150) return '나쁨'
  return '매우 나쁨'
})

const tagType = computed(() => {
  if (!hasAirQuality.value) return 'info'
  if (props.airQuality.usAqi <= 50) return 'success'
  if (props.airQuality.usAqi <= 100) return 'warning'
  return 'danger'
})

const statusIcon = computed(() => {
  if (!hasAirQuality.value) return '?'
  if (props.airQuality.usAqi <= 50) return '✓'
  if (props.airQuality.usAqi <= 100) return '●'
  return '⚠'
})
</script>

<template>
  <el-tag :type="tagType" effect="light" round>
    <span aria-hidden="true">{{ statusIcon }}</span>
    <template v-if="hasAirQuality"
      >대기질 {{ airQualityGrade }} · AQI {{ airQuality.usAqi }}</template
    >
    <template v-else>대기질 정보 없음</template>
  </el-tag>
</template>
