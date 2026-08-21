<script setup>
import { activityOptions } from '@/composables/useActivityScore'

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:model-value'])
</script>

<template>
  <div class="activity-selector">
    <label for="activity-select">활동 종류</label>
    <el-select
      id="activity-select"
      :model-value="modelValue"
      aria-label="야외 활동 종류 선택"
      @change="emit('update:model-value', $event)"
    >
      <el-option
        v-for="option in activityOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </div>
</template>

<style scoped>
.activity-selector {
  display: grid;
  gap: 0.5rem;
}

.el-select {
  width: 100%;
}

label {
  color: var(--color-heading);
  font-weight: 700;
}
</style>
