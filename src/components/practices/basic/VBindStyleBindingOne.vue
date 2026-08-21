<script setup>
import { ref } from 'vue'

// 1. 객체 바인딩용 변수
const Textcolor = ref('purple')
const boxWidth = ref(150) // 숫자만 제어
// 2. 배열 바인딩용 스타일 객체 무더기
const baseBoxStyle = ref({
  backgroundColor: 'lightblue',
  height: '100px',
  transition: 'all 0.3s ease-in-out', // 부드러운 애니메이션 효과
})
</script>

<template>
  <div class="practice-section">
    <h2>V-Bind 디렉티브 고급 (스타일 바인딩)</h2>
    <h3>1. 인라인 스타일 변수 조작(객체 형식)</h3>
    <p class="dynamic-color-text" :style="{ color: Textcolor }">
      이 글자의 색상은 실시간으로 바뀝니다.
    </p>
    <button @click="Textcolor = Textcolor === 'purple' ? 'orange' : 'purple'">색상 토글</button>
    <br />

    <h3>2. 다중 스타일 객체 조립 (배열 형식)</h3>
    <label for="box-width">박스 가로 크기(px):</label>
    <input id="box-width" v-model="boxWidth" type="number" step="50" />
    <br />

    <div :style="[baseBoxStyle, { width: boxWidth + 'px' }]">
      <p class="resizable-box__label">가로 크기: {{ boxWidth }}px 박스</p>
    </div>
  </div>
</template>

<style scoped>
.dynamic-color-text {
  font-weight: 700;
}

.resizable-box__label {
  padding: 10px;
  color: white;
  text-align: center;
}
</style>
