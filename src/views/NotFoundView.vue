<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="not-found">
    <p>404</p>
    <h1>요청한 페이지를 찾을 수 없습니다.</h1>
    <RouterLink to="/">대시보드로 돌아가기</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  display: grid;
  place-items: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

p {
  margin: 0;
  color: var(--color-primary);
  font-size: 5rem;
  font-weight: 850;
}

h1 {
  margin: 0;
}

a {
  display: inline-block;
  color: var(--color-primary);
  font-weight: 800;
}

a:hover {
  color: var(--color-primary-dark);
}

a:active {
  transform: translateY(1px);
}

a:focus-visible {
  border-radius: 0.25rem;
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
</style>
