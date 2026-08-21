<script setup>
const rawHtmlData = '이 글자는 <span class="v-html-highlight">빨간색 굵은 글자</span>이다.'
</script>

<template>
  <div class="practice-section">
    <h2>V-html 디렉티브 학습</h2>
    <h3>일반 보간법 {{}} 사용결과:</h3>
    <p>{{ rawHtmlData }}</p>
    <br />
    <h3>v-html 디렉티브 사용결과:</h3>
    <p v-html="rawHtmlData"></p>
  </div>
</template>

<style scoped>
/* v-html로 삽입되는 동일 컴포넌트의 콘텐츠이므로 deep selector가 필요하다. */
:deep(.v-html-highlight) {
  color: red;
  font-weight: 700;
}
</style>
