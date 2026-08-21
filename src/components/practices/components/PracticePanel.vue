<template>
  <section class="practice-panel">
    <header class="panel-header">
      <slot name="title">컴포넌트 연습</slot>
    </header>
    <div class="panel-content">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="panel-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.practice-panel {
  overflow: hidden;
  background: #fff;
  border: 1px solid #d7dfe9;
  border-radius: 14px;
}

.panel-header,
.panel-content,
.panel-footer {
  padding: 16px 18px;
}

.panel-header {
  background: #eef4fb;
}

.panel-footer {
  color: #52637a;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
</style>
