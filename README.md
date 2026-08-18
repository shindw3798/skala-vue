# SKALA Vue 수업 정리

## 1일차

Vue 프로젝트의 기본 구조와 컴포넌트, 반응형 데이터, Vue Router, Vue Directive(v-bind까지)에 대해 공부했다.

## Vue 프로젝트가 실행되는 순서

브라우저 → `index.html` → `main.js` → `App.vue` → 화면 표시

```text
브라우저
   ↓
index.html
   ↓
main.js
   ↓
createApp(App)
   ↓
app.use(router)
   ↓
App.vue
   │
   ├── RouterLink
   │       ↓
   │    URL 변경
   │
   └── RouterView
           ↑
           │
     router/index.js
       URL 확인
           │
     ┌─────┴──────┐
     ↓            ↓
HomeView.vue   AboutView.vue
     │
     ↓
여러 components
```

## 기본 구조

### main.js

- `import './assets/main.css'`: `main.css`를 불러옴
- `import { createApp } from 'vue'`: Vue 패키지에서 `createApp` 함수를 불러옴
- `const app = createApp(App)`: `App.vue`를 최상위 화면으로 사용하는 Vue 애플리케이션을 만들어라.
- `app.mount('#app')`: 방금 만든 Vue 앱을 `index.html`의 id가 `app`인 곳에 붙여라.

브라우저가 `index.html`을 읽고 `main.js`를 실행한다. `main.js`에서 `App.vue`를 불러오고, `createApp(App)`으로 Vue 앱을 만든다. 이후 `app.mount('#app')`으로 `index.html`의 `#app`에 `App.vue`를 넣는다.

### App.vue

`App.vue`는 Vue 애플리케이션의 Root Component이다.

```vue
<script setup>
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import SampleThree from './components/practices/basic/SampleThree.vue'
import VhtmlOne from './components/practices/basic/VhtmlOne.vue'
import VhtmlTwo from './components/practices/basic/VhtmlTwo.vue'
import Vtext from './components/practices/basic/Vtext.vue'
import VbindOne from './components/practices/basic/VbindOne.vue'
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
</template>
```

- `import SampleOne from '...'`: `SampleOne.vue`라는 부품을 가져온다.
- `<SampleOne />`: 그 부품을 여기에 배치한다.
- HTML에는 원래 `<SampleOne>`이라는 태그가 없다. 우리가 만든 Vue Component이다.
- Vue는 웹 사이트 하나를 통째로 만들지 않고 Header, 검색창, 로그인 버튼, 게시글, 댓글 등 여러 부품으로 쪼개서 만든다고 생각하면 된다.

## SFC(Single File Component)

Vue 컴포넌트를 `.vue` 확장자를 가진 하나의 독립된 파일로 만들고, 내부를 아래 3가지 구조로 나눈다.

- `<script setup>`: 데이터, 함수 등 기능 로직을 JavaScript로 작성하는 곳
- `<template>`: 사용자에게 보여질 HTML 구조를 작성하는 곳
- `<style>`: CSS 스타일을 작성하는 곳. 보통 `scoped`로 적용 범위를 제한한다.

컴포넌트 파일명을 지을 때 Naming Convention은 두 단어 이상으로 조합된 PascalCase를 권장한다.

### Text Interpolation(텍스트 보간)

`{{ }}` 안에 JavaScript 값을 넣으면 Vue가 화면에 찍어준다.

```vue
<script setup>
const welcomeMessage = 'Welcome to Skala-Vue'
</script>

<template>
  <h2>{{ welcomeMessage }}</h2>
  <p>{{ welcomeMessage.toUpperCase() }}</p>
  <p>{{ 'Random number: ' + Math.ceil(Math.random() * 100) }}</p>
</template>
```

## Reactivity(반응형 데이터)

`let count = 0`으로 두고 버튼을 누를 때 `count++`을 해도 실제 변수만 `0 → 1 → 2`로 변한다. Vue가 이 변경을 감시하고 있지 않으면 화면은 자동으로 바뀌지 않는다.

Vue에게 "이 변수는 감시하고, 바뀌면 화면도 다시 갱신해"라고 알려주는 것이 `ref()`이다.

```javascript
import { ref } from 'vue'

const count = ref(0)
```

`ref`로 만든 값이 바뀌면 화면이 실시간으로 갱신된다. 그래서 이것을 반응형 변수라고 한다.

### SampleOne.vue에서 확인한 내용

```vue
<script setup>
import { ref } from 'vue'

let normalCount = 0
const vueCount = ref(0)
</script>

<template>
  <h3>일반 변수 클릭: {{ normalCount }}</h3>
  <button @click="normalCount++">일반 변수 증가</button>

  <h3>반응형 변수 클릭: {{ vueCount }}</h3>
  <button @click="vueCount++">Vue 변수 증가</button>
</template>
```

- `normalCount`는 값은 증가하지만 화면이 실시간으로 바뀌지 않는다.
- `vueCount`는 `ref`로 만든 반응형 변수라 버튼을 누르면 값과 화면이 같이 바뀐다.

### SampleThree.vue에서 느낀 점

```vue
<script setup>
import { ref } from 'vue'

const insaMessage = ref('안녕 이건 연습')
let number = 0
</script>

<template>
  <h2>{{ insaMessage }}</h2>
  <button @click="insaMessage = '안녕 이건 연습2'">인사 변경</button>

  <h3>고정 변수 클릭: {{ number }}</h3>
  <button @click="number++">Vue 변수 증가</button>
</template>
```

처음에는 `ref`를 쓴 문자열 변경 버튼을 누를 때마다 페이지가 새로고침될 거라고 생각했다. 그런데 첫 클릭에서는 `안녕 이건 연습`이 `안녕 이건 연습2`로 바뀌어서 화면이 갱신되지만, 그다음부터는 똑같은 문자열인 `안녕 이건 연습2`를 다시 넣는 것이기 때문에 값이 바뀐 게 없다. 값의 변화가 없으니 Vue도 화면을 다시 갱신하지 않았다.

여기서 말하는 갱신은 브라우저 페이지 전체가 새로고침되는 것이 아니라, 반응형 값이 변했을 때 Vue가 필요한 화면을 다시 그리는 재렌더링이다.

또 `number`는 일반 변수라서 버튼으로 값이 올라가도 그 변화만으로는 화면이 갱신되지 않는다. `insaMessage`가 처음 바뀌면서 재렌더링될 때는 그동안 바뀌어 있던 `number` 값도 화면에 보일 수 있지만, 이후 같은 문자열을 다시 넣으면 `insaMessage`의 값이 바뀌지 않아서 재렌더링도 발생하지 않는다.

## Vue Router

Vue Router는 주소(URL)에 따라 어떤 `.vue` 화면을 보여줄지 결정하는 장치이다.

예를 들어 다음과 같이 주소별 화면이 있다고 하자.

- `/`: 메인 화면
- `/about`: 소개 화면
- `/mypage`: 마이페이지

전통적인 웹 사이트라면 `/about`을 누를 때 서버에 요청해서 새로운 HTML 페이지를 통째로 받아온다. 그런데 Vue SPA에서는 `index.html` 하나를 계속 유지하면서 내부 화면만 바꾼다.

`/about → AboutView.vue`처럼 주소와 화면을 연결하는 것은 `src/router/index.js`에서 정한다.

```javascript
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/about',
      component: AboutView,
    },
  ],
})

export default router
```

- `routes`에서 주소가 `/`이면 `HomeView.vue`를 보여준다.
- 주소가 `/about`이면 `AboutView.vue`를 보여준다.
- `createRouter()`는 라우터 하나를 만든다.
- 만든 라우터는 `main.js`에서 불러오고 `app.use(router)`로 Vue 앱에 장착한다.
- `history: createWebHistory()`는 지금 단계에서는 주소창 관리 설정 정도로 이해했다.
- Router는 **URL ↔ Vue 화면 연결표**이다.
- `RouterView`는 페이지가 갈아 끼워지는 콘센트이다.
- `<RouterLink to="/about">About</RouterLink>`를 누르면 주소가 `/about`으로 변경된다. 전체 새로고침이 아니라 필요한 화면만 교체한다.
- `views`는 URL에 직접 매핑되는 페이지 단위의 큰 화면이다.
- `components`는 페이지 안에서 사용하는 재사용 가능한 작은 부품이다.

## Vue Directive(디렉티브)

Vue Directive는 HTML 태그에 Vue에게 내리는 명령어를 붙이는 것이다.

HTML의 `<a href="https://naver.com">`에서 따옴표 안의 값은 그냥 문자열이다. 하지만 Vue의 `<a :href="url">`에서 `url`은 글자가 아니라 JavaScript 변수 `url`을 뜻한다.

즉 `v-명령어="값"` 구역의 따옴표 내부는 단순 문자열이 아니라 JavaScript 변수나 연산식이 작동하는 공간이다.

### v-html

JavaScript 변수에 담긴 문자열을 단순 텍스트가 아니라 실제 HTML Element로 해석해서 화면에 주입하는 Directive이다.

```vue
<script setup>
const rawHtmlData =
  '이 글자는 <span style="color: red"; font-weight: bold;>빨간색 굵은 글자</span>이다.'
</script>

<template>
  <div class="practice-section">
    <h2>V-html 디렉티브 학습</h2>
    <h3>일반 보간법 사용 결과:</h3>
    <p>{{ rawHtmlData }}</p>

    <h3>v-html 디렉티브 사용 결과:</h3>
    <p v-html="rawHtmlData"></p>
  </div>
</template>
```

일반 보간법을 사용하면 태그도 문자열 그대로 보이지만, `v-html`을 사용하면 문자열 속의 `<span>`을 실제 HTML 태그로 해석한다.

```vue
<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const message = ref('')

function showMessage() {
  message.value = inputValue.value
}
</script>

<template>
  <div class="practice-section">
    <h2>v-html XSS 학습</h2>
    <input v-model="inputValue" placeholder="내용을 입력하세요" />
    <button @click="showMessage">확인</button>
    <p v-html="message"></p>
  </div>
</template>
```

사용자가 입력한 값을 그대로 `v-html`로 실행할 수 있게 만들면 XSS(Cross-Site Scripting) 위험이 존재한다. 그래서 사용자가 입력한 값이나 믿을 수 없는 데이터에는 함부로 사용하면 안 된다.

### v-text

`v-text`는 Text Interpolation인 `{{ }}`와 거의 같은 역할을 한다. 태그가 들어 있는 문자열도 HTML로 실행하지 않고 그냥 글자로 보여준다. 실무에서는 보통 `{{ }}`를 더 많이 사용한다고 한다.

```vue
<script setup>
const content = '안녕! <strong>Skala-Vue</strong> 연습중입니다.'
</script>

<template>
  <div class="practice-section">
    <h2>v-text 연습</h2>

    <h3>1. 일반 보간법 결과:</h3>
    <p>출력: {{ content }}</p>

    <h3>2. v-text 디렉티브 결과:</h3>
    <p v-text="'출력: ' + content"></p>

    <h3>3. v-html 결과 비교:</h3>
    <p v-html="content"></p>
  </div>
</template>
```

- `{{ content }}`: 문자열을 글자 그대로 출력
- `v-text="content"`: 문자열을 글자 그대로 출력
- `v-html="content"`: 문자열을 HTML로 해석해서 `<strong>`이 적용됨

### v-bind

`v-bind`는 HTML 태그 내부의 Attribute에 JavaScript 값을 동적으로 연결하는 지시자이다.

실무에서는 `v-bind`라는 긴 글자를 전부 쓰지 않고 앞에 콜론(`:`) 하나만 남긴 축약형을 사용한다.

```text
v-bind:href="dynamicUrl"  ==  :href="dynamicUrl"
v-bind:src="logoImgSrc"  ==  :src="logoImgSrc"
```

이번에는 링크의 `href`, 이미지의 `src`, 버튼의 `disabled` 속성에 값을 연결해봤다.

```vue
<script setup>
import { ref } from 'vue'

const dynamicUrl = 'https://www.naver.com'
const logoImgSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>V-Bind 연습 (축약형: 콜론)</h2>

    <h3>1. 동적 링크 연결</h3>
    <a :href="dynamicUrl">여기 클릭시 네이버로 이동</a>

    <h3>2. 동적 이미지 연결</h3>
    <img :src="logoImgSrc" alt="Vue Logo" style="width: 100px; height: 100px" />

    <h3>3. 버튼 비활성화 제어</h3>
    <p>현재 버튼 사용 불가능 상태: {{ isButtonDisabled }}</p>
    <button :disabled="isButtonDisabled">동의해야 클릭할 수 있는 버튼</button>
    <button @click="isButtonDisabled = !isButtonDisabled">위 버튼 잠금 해제/토글하기</button>
  </div>
</template>
```

- `:href="dynamicUrl"`: `dynamicUrl` 값을 링크 주소에 연결
- `:src="logoImgSrc"`: `logoImgSrc` 값을 이미지 주소에 연결
- `:disabled="isButtonDisabled"`: 값이 `true`면 버튼을 비활성화하고, `false`면 버튼을 사용할 수 있게 함
- 토글 버튼을 누르면 `true ↔ false`로 값이 바뀌고 버튼 상태도 같이 바뀐다.

## 오늘 내용 요점만 압축

`package.json`  
→ 프로젝트 설정, 라이브러리, 실행 명령 관리

`index.html`  
→ 브라우저가 최초로 읽는 HTML  
→ `<div id="app"></div>`라는 빈 자리 존재

`main.js`  
→ Vue 앱을 시작함  
→ `App.vue`를 가져옴  
→ `app.mount('#app')`으로 HTML에 Vue를 붙임

`App.vue`  
→ 가장 위의 Vue 컴포넌트

`.vue` 파일  
→ 화면 부품  
→ script + template + style

`<script setup>`  
→ JavaScript 작성

`<template>`  
→ HTML 화면 작성

`<style>`  
→ CSS 작성

`{{ 변수 }}`  
→ JavaScript 값을 화면에 출력

`ref()`  
→ 값이 바뀌었을 때 화면도 자동으로 바뀌게 만드는 Vue의 반응성 기능

Vue Router  
→ URL에 맞는 Vue 화면을 연결하고, 전체 페이지를 새로고침하지 않고 필요한 화면만 교체

Vue Directive  
→ HTML 태그에 Vue 명령어를 붙이는 것

`v-html`  
→ 문자열을 실제 HTML로 해석해서 출력. XSS 위험에 주의

`v-text`  
→ 문자열을 일반 텍스트로 출력. `{{ }}`와 거의 같은 역할

`v-bind` 또는 `:`  
→ HTML Attribute에 JavaScript 값을 동적으로 연결
