<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import SampleThree from './components/practices/basic/SampleThree.vue'
import VhtmlOne from './components/practices/basic/VHtmlOne.vue'
import VhtmlTwo from './components/practices/basic/VHtmlTwo.vue'
import Vtext from './components/practices/basic/VText.vue'
import VbindOne from './components/practices/basic/VBindOne.vue'
import VBindClassBindingOne from './components/practices/basic/VBindClassBindingOne.vue'
import VBindStyleBindingOne from './components/practices/basic/VBindStyleBindingOne.vue'
import VBindLast from './components/practices/basic/VBindLast.vue'
import VIf from './components/practices/basic/VIf.vue'
import VShow from './components/practices/basic/VShow.vue'
import VFor from './components/practices/basic/VFor.vue'
import VPre from './components/practices/basic/VPre.vue'
import VCloak from './components/practices/basic/VCloak.vue'
import VOnce from './components/practices/basic/VOnce.vue'
import VMemo from './components/practices/basic/VMemo.vue'
import VOn from './components/practices/basic/VOn.vue'
import VEvent from './components/practices/basic/VEvent.vue'
</script>

<template>
  <h1>Hello Skala-Vue</h1>
  <SampleOne />
  <SampleTwo />
  <SampleThree />
  <VhtmlOne />
  <VhtmlTwo />
  <Vtext />
  <VbindOne />
  <VBindClassBindingOne />
  <VBindStyleBindingOne />
  <VBindLast />
  <VIf />
  <VShow />
  <VFor />
  <VPre />
  <VCloak />
  <VOnce />
  <VMemo />
  <VOn />
  <VEvent />
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
