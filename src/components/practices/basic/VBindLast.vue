<script setup>
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
</script>

<template>
  <div class="practice-section">
    <h2>V-Bind 단축 문법</h2>
    <div :id>
      <img class="vue-logo" :src alt="Vue Logo" />
    </div>
  </div>
</template>

<style scoped>
.vue-logo {
  width: 50px;
}
</style>
