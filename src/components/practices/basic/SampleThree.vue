<script setup>
import { ref } from 'vue'

const insaMessage = ref('안녕 이건 연습')
let number = 0
</script>

<template>
  <div class="practice-section">
    <h2>{{ insaMessage }}</h2>
    <button @click="insaMessage = '안녕 이건 연습2'">인사 변경</button>
    <h3>고정 변수 클릭: {{ number }}</h3>
    <button @click="number++">Vue 변수 증가</button>
  </div>
</template>
