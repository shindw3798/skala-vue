import './assets/main.css' // main.css를 불러옴
import 'element-plus/dist/index.css'

import { createApp } from 'vue' // vue 패키지에서 createApp 함수를 불러옴
import { createPinia } from 'pinia'
import {
  ElAlert,
  ElButton,
  ElCard,
  ElEmpty,
  ElInput,
  ElOption,
  ElProgress,
  ElSelect,
  ElSkeleton,
  ElTag,
} from 'element-plus'

import App from './App.vue'
import router from './router' // import router from './router/index.js'랑 같은 의미

const app = createApp(App) // App.vue를 최상위 화면으로 사용하는 Vue 애플리케이션을 만들어라.
const elementComponents = [
  ElAlert,
  ElButton,
  ElCard,
  ElEmpty,
  ElInput,
  ElOption,
  ElProgress,
  ElSelect,
  ElSkeleton,
  ElTag,
]

app.use(createPinia())
app.use(router)
elementComponents.forEach((component) => app.component(component.name, component))

app.mount('#app') // 방금 만든 Vue 앱을 index.html의 id가 app인 곳에 붙여라.

// 브라우저가 index.html을 읽고
// <script src="main.js">를 발견 후 main.js 실행
// main.js에서 App.vue 불러오고, createApp(App)으로 Vue 앱을 만들기
// 이후 app.mount('#app')로 index.html의 #app에 App.vue를 넣기
// 브라우저 -> index.html -> main.js -> App.vue -> 화면 표시
