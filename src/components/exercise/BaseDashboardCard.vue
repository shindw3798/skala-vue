<template>
  <section class="dashboard-card">
    <header v-if="$slots.header" class="dashboard-card__header">
      <slot name="header" />
    </header>
    <div class="dashboard-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.dashboard-card {
  overflow: hidden;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-large);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.dashboard-card__header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.dashboard-card__body {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .dashboard-card__header,
  .dashboard-card__body {
    padding: 1rem;
  }
}
</style>
