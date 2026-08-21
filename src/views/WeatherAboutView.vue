<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="about-view">
    <p class="eyebrow">프로젝트 소개</p>
    <h1>날씨와 야외 활동 정보를 연결한 Vue 실습</h1>
    <p>
      SKALA Vue.js 교재의 Hands on 과제를 순서대로 연결하고, 활동 적합도와 대기질 기능을
      추가했습니다.
    </p>
    <section>
      <h2>데이터 출처</h2>
      <ul>
        <li>
          <a href="https://openweathermap.org/current" target="_blank" rel="noopener noreferrer">
            OpenWeather Current Weather API
          </a>
          : 현재 기온, 습도, 바람, 강수
        </li>
        <li>
          <a href="https://openweathermap.org/forecast5" target="_blank" rel="noopener noreferrer">
            OpenWeather 5 Day / 3 Hour Forecast API
          </a>
          : 단기 예보
        </li>
        <li>
          <a
            href="https://open-meteo.com/en/docs/air-quality-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo Air Quality API
          </a>
          : US AQI와 PM2.5 (대기질 원자료: CAMS)
        </li>
      </ul>
    </section>
    <section>
      <h2>활동 점수 안내</h2>
      <p>
        활동 적합도는 기온·습도·풍속·강수·대기질로 계산한 수업용 점수입니다. 건강 상태나 야외 활동의
        안전을 판단하는 기준은 아닙니다.
      </p>
    </section>
    <RouterLink class="back-link" to="/">대시보드로 돌아가기 →</RouterLink>
  </main>
</template>

<style scoped>
.about-view {
  max-width: 820px;
  margin: 0 auto;
  padding: clamp(1.5rem, 5vw, 4rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  background: var(--color-surface);
}

.eyebrow {
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: 1.1;
}

section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: var(--color-primary);
  font-weight: 800;
}

a {
  color: var(--color-primary);
}

a:hover {
  color: var(--color-primary-dark);
}

a:active {
  transform: translateY(1px);
}

a:focus-visible {
  border-radius: 0.25rem;
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
</style>
