<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedCity: {
    type: Object,
    default: null,
  },
  query: {
    type: String,
    default: '',
  },
  resultCount: {
    type: Number,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
})

const selectionMessage = computed(() =>
  props.selectedCity ? `선택한 도시: ${props.selectedCity.nameKo}` : '날씨 카드를 선택해 보세요.',
)

const searchMessage = computed(() => {
  const normalizedQuery = props.query.trim()
  return normalizedQuery
    ? `‘${normalizedQuery}’ 검색 결과 ${props.resultCount}곳`
    : `전체 도시 ${props.totalCount}곳을 표시하고 있습니다.`
})
</script>

<template>
  <div class="status-bar" role="status" aria-live="polite">
    <strong>{{ selectionMessage }}</strong>
    <span>{{ searchMessage }}</span>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.8rem 1rem;
  border-left: 4px solid var(--color-primary);
  border-radius: 0 var(--radius-small) var(--radius-small) 0;
  background: var(--color-primary-soft);
  color: var(--color-heading);
}

.status-bar strong {
  font-weight: 650;
}

.status-bar span {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  text-align: right;
}

@media (max-width: 600px) {
  .status-bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .status-bar span {
    text-align: left;
  }
}
</style>
