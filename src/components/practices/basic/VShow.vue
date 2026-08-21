<script setup>
import { ref } from 'vue'
const isActive = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>v-show</h2>
    <button @click="isActive = !isActive">화면 토글</button>
    <br />

    <div v-show="isActive" class="box">
      <p>v-show 상자</p>
      <p>조건이 false가 되면 CSS display: none;이 적용됩니다.</p>
    </div>
  </div>
</template>

<style scoped>
.box {
  padding: 15px;
  margin-top: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}
</style>
