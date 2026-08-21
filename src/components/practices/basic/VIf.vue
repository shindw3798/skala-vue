<script setup>
import { ref } from 'vue'

const isLogged = ref(false)
const score = ref(85)
</script>

<template>
  <div class="practice-section">
    <h2>V-if, V-else, V-else-if 학습</h2>
    <p v-if="isLogged">로그인 상태입니다.</p>
    <p v-else>로그인 상태가 아닙니다. 로그인 해주세요</p>

    <button @click="isLogged = !isLogged">
      {{ isLogged ? '로그아웃' : '로그인' }}
    </button>
    <br />

    <h3>성적별 학점 등급 측정(다중 if문)</h3>
    <label for="score-input">현재 점수 입력:</label>
    <input id="score-input" v-model="score" type="number" min="0" max="100" step="5" />

    <p v-if="score >= 90" class="grade grade--a">A학점</p>
    <p v-else-if="score >= 80" class="grade grade--b">B학점</p>
    <p v-else-if="score >= 70" class="grade grade--c">C학점</p>
    <p v-else class="grade grade--f">F학점 공부좀 해라</p>
  </div>
</template>

<style scoped>
.grade {
  font-weight: 700;
}

.grade--a {
  color: green;
}

.grade--b {
  color: blue;
}

.grade--c {
  color: orange;
}

.grade--f {
  color: red;
}
</style>
