<script setup>
import { ref } from 'vue'

const dynamicUrl = 'https://www.naver.com'
const logoImgSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>V-Bind 연습 (축약형: 콜론)</h2>
    <h3>1. 동적 링크 연결</h3>
    <a :href="dynamicUrl">여기 클릭시 네이버로 이동</a>
    <br />

    <h3>2. 동적 이미지 연결</h3>
    <img class="vue-logo" :src="logoImgSrc" alt="Vue Logo" />
    <br />

    <h3>3. 버튼 비활성화 제어</h3>
    <p>현재 버튼 사용 불가능 상태: {{ isButtonDisabled }}</p>
    <button :disabled="isButtonDisabled">동의해야 클릭할 수 있는 버튼</button>&nbsp;
    <button @click="isButtonDisabled = !isButtonDisabled">위 버튼 잠금 해제/토글하기</button>
  </div>
</template>

<style scoped>
.vue-logo {
  width: 100px;
  height: 100px;
}
</style>
