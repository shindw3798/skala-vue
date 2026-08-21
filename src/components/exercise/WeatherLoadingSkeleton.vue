<script setup>
defineProps({
  count: {
    type: Number,
    default: 1,
  },
  label: {
    type: String,
    default: '날씨 정보를 불러오는 중입니다.',
  },
})
</script>

<template>
  <div class="skeleton-grid" role="status" aria-live="polite" :aria-label="label">
    <el-card v-for="item in count" :key="item" class="skeleton-card" shadow="never">
      <el-skeleton animated :rows="4" />
    </el-card>
    <span class="sr-only">{{ label }}</span>
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  min-width: 0;
}

.skeleton-card {
  min-height: 230px;
  border-color: var(--color-border);
  border-radius: var(--radius-medium);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 760px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
