<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import { usePreferenceStore } from '@/stores/preferenceStore'

const preferenceStore = usePreferenceStore()
const activityRoute = computed(() => ({
  name: 'activity-insight',
  params: { cityId: preferenceStore.lastCityId },
}))
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">본문으로 바로가기</a>
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="WeatherFit Insight 홈">
        <span class="brand__mark" aria-hidden="true">W</span>
        <span>
          <strong>WeatherFit</strong>
          <small>INSIGHT</small>
        </span>
      </RouterLink>

      <nav aria-label="주요 메뉴">
        <RouterLink to="/">날씨</RouterLink>
        <RouterLink :to="activityRoute">활동 인사이트</RouterLink>
        <RouterLink to="/about">프로젝트 소개</RouterLink>
      </nav>

      <UnitToggler />
    </header>

    <div id="main-content" class="page-container" tabindex="-1">
      <RouterView />
    </div>

    <footer class="site-footer">
      <span>WeatherFit Insight</span>
      <span>Vue 3 + Vite · SKALA Vue.js 종합과제</span>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  min-width: 0;
}

.skip-link {
  position: fixed;
  z-index: 1000;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: var(--radius-small);
  background: var(--color-heading);
  color: #fff;
  transform: translateY(-160%);
  transition: transform 140ms ease;
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  position: sticky;
  z-index: 50;
  top: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 1rem 0;
  background: color-mix(in srgb, var(--color-background) 88%, transparent);
  backdrop-filter: blur(16px);
}

.brand {
  display: inline-flex;
  gap: 0.65rem;
  align-items: center;
  color: var(--color-heading);
  text-decoration: none;
  border-radius: var(--radius-small);
}

.brand:hover {
  color: var(--color-primary-dark);
}

.brand:active {
  transform: translateY(1px);
}

.brand:focus-visible,
.site-footer a:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 0.75rem;
  background: var(--color-primary);
  color: #fff;
  font-weight: 900;
}

.brand strong,
.brand small {
  display: block;
  line-height: 1.05;
}

.brand small {
  margin-top: 0.2rem;
  color: var(--color-text-muted);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
}

nav a {
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    background-color 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

nav a:hover,
nav a:focus-visible,
nav a.router-link-exact-active {
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  outline: none;
}

nav a:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus);
}

nav a:active {
  transform: translateY(1px);
}

.page-container {
  width: min(1180px, calc(100% - 2rem));
  margin: 1.25rem auto 3rem;
  min-width: 0;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 1.5rem 0 2.5rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

@media (max-width: 760px) {
  .site-header {
    grid-template-columns: 1fr auto;
  }

  nav {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  nav a {
    white-space: nowrap;
  }
}

@media (max-width: 420px) {
  .site-header,
  .page-container,
  .site-footer {
    width: min(100% - 1rem, 1180px);
  }

  .site-header {
    gap: 0.75rem;
  }

  .brand__mark {
    width: 2rem;
    height: 2rem;
  }

  nav {
    gap: 0.25rem;
  }

  nav a {
    padding: 0.45rem 0.6rem;
    font-size: 0.8rem;
    white-space: normal;
  }
}

@media (max-width: 460px) {
  .site-footer {
    flex-direction: column;
  }
}
</style>
