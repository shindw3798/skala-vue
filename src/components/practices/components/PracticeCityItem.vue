<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select-city', 'open-detail'])
</script>

<template>
  <li class="city-item" :class="{ selected }">
    <button class="select-button" type="button" @click="$emit('select-city', city.id)">
      <strong>{{ city.name }}</strong>
      <span>{{ city.summary }}</span>
    </button>
    <button class="detail-button" type="button" @click="$emit('open-detail', city.id)">
      정보 보기
    </button>
  </li>
</template>

<style scoped>
.city-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border: 1px solid #cad4e1;
  border-radius: 10px;
  cursor: pointer;
}

.city-item.selected {
  background: #eef5ff;
  border-color: #2768bd;
}

.city-item span {
  display: block;
}

.city-item span {
  margin-top: 4px;
  color: #5f6f83;
}

.select-button {
  flex: 1;
  padding: 0;
  color: inherit;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.detail-button {
  flex: 0 0 auto;
  padding: 8px 12px;
  color: #fff;
  background: #2768bd;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.select-button:focus-visible,
.detail-button:focus-visible {
  outline: 3px solid #8db8f2;
  outline-offset: 2px;
}
</style>
