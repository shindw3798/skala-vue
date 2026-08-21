<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const { unit, unitSymbol } = storeToRefs(configStore)
</script>

<template>
  <section class="store-practice" aria-labelledby="store-title">
    <h2 id="store-title">Pinia Store 복습</h2>
    <p>현재 단위: {{ unit }} ({{ unitSymbol }})</p>
    <button type="button" @click="configStore.toggleUnit">온도 단위 바꾸기</button>
  </section>
</template>

<style scoped>
.store-practice {
  width: min(100%, 520px);
  padding: 20px;
  background: #f7f9fc;
  border: 1px solid #d5deea;
  border-radius: 14px;
}

button {
  padding: 9px 14px;
  color: #fff;
  background: #2768bd;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

button:focus-visible {
  outline: 3px solid #8db8f2;
  outline-offset: 2px;
}
</style>
