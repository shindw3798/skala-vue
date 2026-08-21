<script setup>
import { toRef } from 'vue'
import AirQualityBadge from './AirQualityBadge.vue'
import { useTemperature } from '@/composables/useTemperature'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  selected: Boolean,
  favorite: Boolean,
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])
const { displayTemperature, unitSymbol } = useTemperature(toRef(props.cityItem, 'temperature'))
</script>

<template>
  <article class="weather-card" :class="{ 'weather-card--selected': selected }">
    <button
      class="weather-card__select-control"
      type="button"
      :aria-label="`${cityItem.nameKo} 날씨 카드 선택`"
      :aria-pressed="selected"
      @click="emit('select-card', cityItem)"
    >
      <span class="sr-only">{{ cityItem.nameKo }} 선택</span>
    </button>

    <div class="weather-card__heading">
      <div>
        <p>{{ cityItem.regionKo }}</p>
        <h3>{{ cityItem.nameKo }}</h3>
        <el-tag v-if="selected" type="success" size="small" effect="dark">
          <span aria-hidden="true">✓</span> 선택됨
        </el-tag>
      </div>
      <button
        class="favorite-button"
        type="button"
        :aria-label="
          favorite ? `${cityItem.nameKo} 즐겨찾기 해제` : `${cityItem.nameKo} 즐겨찾기 추가`
        "
        :aria-pressed="favorite"
        @click.stop="emit('toggle-favorite', cityItem.id)"
      >
        <span aria-hidden="true">{{ favorite ? '★' : '☆' }}</span>
      </button>
    </div>

    <div class="weather-card__content">
      <div class="weather-card__temperature">
        {{ displayTemperature }}<span>{{ unitSymbol }}</span>
      </div>
      <p class="weather-card__status">
        {{ cityItem.status
        }}<template v-if="cityItem.description"> · {{ cityItem.description }}</template>
      </p>
      <el-tag v-if="cityItem.temperature >= 25" type="danger" effect="plain">
        더움 (25℃ 이상)
      </el-tag>
      <el-tag v-else type="info" effect="plain">선선함 (25℃ 미만)</el-tag>

      <dl class="weather-card__metrics">
        <div>
          <dt>습도</dt>
          <dd>{{ cityItem.humidity }}%</dd>
        </div>
        <div>
          <dt>바람</dt>
          <dd>{{ cityItem.windSpeed }}m/s</dd>
        </div>
        <div>
          <dt>강수</dt>
          <dd>{{ cityItem.precipitation }}mm</dd>
        </div>
      </dl>
    </div>

    <div class="weather-card__footer">
      <AirQualityBadge :air-quality="cityItem.airQuality" />
      <el-button type="primary" plain @click.stop="emit('click-detail', cityItem.id)">
        상세보기
      </el-button>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  display: grid;
  gap: 1rem;
  min-height: 100%;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-medium);
  background: var(--color-surface-raised);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.weather-card:hover,
.weather-card:focus-within {
  transform: translateY(-3px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-hover);
}

.weather-card--selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.weather-card__heading,
.weather-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.weather-card__heading p,
.weather-card__status {
  margin: 0;
  color: var(--color-text-muted);
}

.weather-card__content {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.weather-card__select-control {
  position: absolute;
  z-index: 1;
  inset: 0;
  border: 0;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;
}

.weather-card__select-control:focus-visible,
.favorite-button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.weather-card__select-control:active {
  background: rgba(22, 133, 116, 0.04);
}

h3 {
  margin: 0.15rem 0 0;
  font-size: 1.35rem;
  font-weight: 800;
}

h3 + .el-tag {
  margin-top: 0.45rem;
}

.favorite-button {
  position: relative;
  z-index: 2;
  border: 0;
  background: transparent;
  color: #a96200;
  font-size: 1.7rem;
  cursor: pointer;
}

.weather-card__footer {
  position: relative;
  z-index: 2;
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

.favorite-button:hover {
  transform: scale(1.12);
}

.favorite-button:active {
  transform: scale(0.96);
}

.weather-card__temperature {
  color: var(--color-heading);
  font-size: clamp(2.4rem, 7vw, 3.5rem);
  font-weight: 800;
  line-height: 1;
}

.weather-card__temperature span {
  font-size: 1.25rem;
  font-weight: 700;
}

.weather-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0;
  padding: 0.85rem 0;
  border-block: 1px solid var(--color-border);
}

.weather-card__metrics div {
  text-align: center;
}

.weather-card__metrics div + div {
  border-left: 1px solid var(--color-border);
}

dt {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

dd {
  margin: 0.2rem 0 0;
  font-weight: 700;
}

@media (max-width: 420px) {
  .weather-card__footer {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
