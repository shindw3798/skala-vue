<script setup>
import { computed } from 'vue'

const props = defineProps({
  insight: {
    type: Object,
    required: true,
  },
  activityLabel: {
    type: String,
    required: true,
  },
})

const progressColor = computed(() => {
  if (props.insight.score >= 85) return '#168574'
  if (props.insight.score >= 70) return '#409eff'
  if (props.insight.score >= 50) return '#e9a23b'
  return '#e15b64'
})

const gradePresentation = computed(() => {
  const presentations = {
    '매우 좋음': { type: 'success', icon: '✓' },
    좋음: { type: 'primary', icon: '●' },
    보통: { type: 'warning', icon: '!' },
    나쁨: { type: 'danger', icon: '⚠' },
  }
  return presentations[props.insight.grade] ?? presentations.보통
})
</script>

<template>
  <el-card class="score-card" shadow="never">
    <div class="score-card__heading">
      <div>
        <p>{{ activityLabel }} 적합도</p>
        <h2>{{ insight.score }}<span>/100</span></h2>
      </div>
      <el-tag :type="gradePresentation.type" effect="dark">
        <span aria-hidden="true">{{ gradePresentation.icon }}</span>
        {{ insight.grade }}
      </el-tag>
    </div>
    <el-progress
      :percentage="insight.score"
      :color="progressColor"
      :stroke-width="14"
      :show-text="false"
      :aria-label="`${activityLabel} 적합도 ${insight.score}점`"
    />
    <p class="recommendation">{{ insight.recommendation }}</p>
    <h3>점수 분석</h3>
    <ul>
      <li v-for="reason in insight.reasons" :key="reason">{{ reason }}</li>
    </ul>
  </el-card>
</template>

<style scoped>
.score-card {
  border: 0;
  border-radius: var(--radius-large);
  background: linear-gradient(145deg, var(--color-surface), var(--color-primary-soft));
  box-shadow: var(--shadow-card);
}

.score-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.score-card__heading p,
.recommendation {
  margin: 0;
  color: var(--color-text-muted);
}

h2 {
  margin: 0.2rem 0 0;
  color: var(--color-heading);
  font-size: 3rem;
  line-height: 1;
}

h2 span {
  font-size: 1rem;
}

h3 {
  margin: 1.25rem 0 0.5rem;
  font-size: 1rem;
}

.recommendation {
  margin-top: 1rem;
  font-weight: 650;
}

ul {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-text-muted);
}

@media (max-width: 380px) {
  .score-card__heading {
    align-items: flex-start;
    flex-direction: column;
  }

  h2 {
    font-size: 2.5rem;
  }
}
</style>
