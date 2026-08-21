<script setup>
defineProps({
  query: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="empty-state" role="status" aria-live="polite">
    <el-empty description="검색 결과와 일치하는 도시가 없습니다." :image-size="96" />
    <p v-if="query.trim()">
      입력한 검색어: <strong>{{ query.trim() }}</strong>
    </p>
  </section>
</template>

<style scoped>
.empty-state {
  padding: 1rem 0;
  text-align: center;
}

.empty-state p {
  margin: -1rem 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
</style>
