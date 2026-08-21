<script setup>
defineProps({
  searches: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select-search', 'clear-searches'])
</script>

<template>
  <section v-if="searches.length" class="recent-searches" aria-labelledby="recent-search-title">
    <div class="recent-searches__heading">
      <h3 id="recent-search-title">최근 검색</h3>
      <el-button
        text
        size="small"
        aria-label="최근 검색어 전체 삭제"
        @click="emit('clear-searches')"
      >
        전체 삭제
      </el-button>
    </div>
    <div class="recent-searches__list" aria-label="최근 도시 검색어">
      <button
        v-for="search in searches"
        :key="search"
        class="recent-searches__item"
        type="button"
        @click="emit('select-search', search)"
      >
        <el-tag effect="plain" round>⌕ {{ search }}</el-tag>
      </button>
    </div>
  </section>
</template>

<style scoped>
.recent-searches {
  display: grid;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  background: var(--color-surface-raised);
}

.recent-searches__heading,
.recent-searches__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.recent-searches__heading {
  justify-content: space-between;
}

h3 {
  margin: 0;
  color: var(--color-heading);
  font-size: 0.85rem;
}

.recent-searches__item {
  --el-tag-border-color: var(--color-border);
  --el-tag-text-color: var(--color-text-muted);

  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
}

.recent-searches__item:hover {
  --el-tag-border-color: var(--color-primary);
  --el-tag-text-color: var(--color-primary-dark);
}

.recent-searches__item:active {
  transform: translateY(1px);
}

.recent-searches__item:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
</style>
