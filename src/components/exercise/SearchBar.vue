<script setup>
defineProps({
  query: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query', 'submit-search'])
</script>

<template>
  <div class="search-bar">
    <label for="city-search">도시 검색</label>
    <el-input
      id="city-search"
      :model-value="query"
      clearable
      placeholder="서울, 수원, 부산, 광주를 검색해 보세요"
      aria-label="한글 도시 이름 검색"
      @input="emit('update-query', $event)"
      @keyup.enter="emit('submit-search', query.trim())"
    >
      <template #prefix><span aria-hidden="true">⌕</span></template>
      <template #append>
        <el-button
          :disabled="!query.trim()"
          aria-label="현재 도시 검색어를 최근 검색에 저장"
          @click="emit('submit-search', query.trim())"
        >
          검색
        </el-button>
      </template>
    </el-input>
    <p aria-live="polite">
      현재 검색어: <strong>{{ query || '없음' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar {
  display: grid;
  gap: 0.5rem;
}

label {
  color: var(--color-heading);
  font-weight: 700;
}

p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}
</style>
