# WeatherFit Insight

SKALA Vue.js Hands on 과제를 연결하고 야외 활동 추천 기능을 추가한 Vue 3 날씨 대시보드

## 배포 주소

- [https://skala-vue-silk.vercel.app/](https://skala-vue-silk.vercel.app/)

## 프로젝트 개요

교재에서 배운 Vue 문법, 컴포넌트, Router, Pinia와 Axios를 한 프로젝트에서 사용하기 위해 만들었습니다. 서울·수원·부산·광주의 날씨를 조회하고, 러닝·산책·자전거 중 선택한 활동의 적합도를 계산합니다.

OpenWeather API Key가 설정된 환경에서는 실제 API 데이터를 사용합니다. Key가 없을 때는 환경변수 설정 안내와 `데모 데이터` 표식을 함께 표시하여 실제 응답과 구분합니다.

## 개발 목적

- 교재의 단원별 과제를 하나의 날씨 앱으로 연결했습니다.
- View, Component, Store, composable과 API 서비스의 역할을 나눠 작성했습니다.
- 날씨 값을 표시하는 데서 끝내지 않고 활동 점수와 추천 시간에 활용했습니다.
- 기존 실습 컴포넌트와 학습 기록은 종합과제 코드와 분리해 뒀습니다.

## 주요 기능

- **한글 도시 검색:** 서울·수원·부산·광주를 한글 또는 영문 이름으로 검색하고, 검색어가 없으면 전체 도시를 표시합니다.
- **현재 날씨:** 도시별 기온, 날씨 상태, 습도, 풍속, 강수량을 카드로 표시합니다.
- **상세 날씨:** 도시 ID 기반 상세 Route에서 체감 온도와 주요 관측값을 확인합니다.
- **단기 예보:** OpenWeather 5 Day / 3 Hour Forecast 응답 중 8개 항목을 시간대별로 표시합니다.
- **대기질:** Open-Meteo Air Quality API의 US AQI와 PM2.5를 조회하고 텍스트·아이콘·태그로 상태를 표시합니다.
- **섭씨/화씨 변환:** Navbar의 단위 전환 버튼을 통해 홈, 상세, 활동 화면의 기온 단위를 함께 변경하며 선택한 단위를 새로고침 후에도 유지합니다.
- **활동 적합도:** 러닝·산책·자전거별 적정 조건을 기준으로 0~100점, 등급, 감점 이유와 추천 문장을 제공합니다.
- **활동 추천 시간:** 표시된 3시간 단위 예보를 활동별 점수로 비교해 가장 적합한 시간대를 추천합니다.
- **즐겨찾기와 최근 검색:** 도시 즐겨찾기, 선택 활동과 최근 검색어를 Pinia와 `localStorage`에 저장하며 검색 태그를 다시 선택하거나 전체 삭제할 수 있습니다.
- **상태 처리:** Skeleton 로딩, Alert 오류와 재시도, Empty 빈 상태, API Key 누락 안내를 제공합니다.

## 개인화 기능

### 활동 적합도 계산 목적

기온과 AQI 같은 값을 단순히 보여 주는 것보다, 선택한 활동을 하기 괜찮은 날씨인지 한눈에 확인할 수 있도록 점수로 계산했습니다.

### 입력 변수

- 활동 종류: `running`, `walking`, `cycling`
- 현재 기온
- 습도
- 풍속
- 날씨 상태 또는 강수량
- US AQI

### 계산 방식

100점에서 시작하여 활동별 적정 기온 범위를 벗어난 정도, 과도하거나 낮은 습도, 활동별 풍속 한계 초과, 비·눈, US AQI 구간에 따라 감점합니다. 최종 점수는 `Math.max(0, Math.min(100, score))` 방식으로 0~100 범위에 제한하고 다음 등급으로 구분합니다.

| 점수      | 등급      |
| --------- | --------- |
| 85점 이상 | 매우 좋음 |
| 70~84점   | 좋음      |
| 50~69점   | 보통      |
| 49점 이하 | 나쁨      |

세부 감점 기준은 `src/composables/useActivityScore.js`의 `ACTIVITY_SCORE_RULES` 상수에서 관리합니다.

### 한계

이 점수는 수업에서 반응형 계산과 함수 분리를 연습하기 위해 만든 기준입니다. 따라서 건강 상태를 판단하거나 야외 활동의 안전을 보장하는 값은 아닙니다.

## 교재 Hands on 요구사항 반영표

| 영역                        | 상태           | 구현 내용                                                                                                                                                                                                                               | 주요 근거                                                                            |
| --------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Vue Syntax / Weather Mockup | 완료           | 반응형 `weatherList`, `v-for`와 `city.id` 기반 `:key`, 기온별 `v-if`, 한글 입력 처리, 카드 선택 상태와 상세 버튼의 `.stop` 구현                                                                                                         | `WeatherHomeView.vue`, `SearchBar.vue`, `WeatherCard.vue`, `StatusBar.vue`           |
| Composition API             | 완료           | `searchQuery`, `selectedCityInfo`, `weatherList`를 `ref`로 관리하고 `filteredWeatherList`를 `computed`로 계산합니다. 선택 도시는 `watch`, 검색어는 `watchEffect`로 추적하며 평균 기온 계산을 추가했습니다.                              | `WeatherHomeView.vue`, `useWeatherData.js`, `useActivityScore.js`                    |
| Components                  | 완료           | 부모 View가 상태를 관리하고 `BaseDashboardCard`의 slot, `SearchBar`의 props/update-query emits, `WeatherCard`의 props/select-card/click-detail emits로 통신합니다. 상태바·빈 상태·예보·대기질·활동 점수를 추가 컴포넌트로 분리했습니다. | `src/components/exercise/`, `WeatherHomeView.vue`                                    |
| Router                      | 완료           | 모든 View를 Lazy Loading으로 등록하고 동적 도시 Route, 프로그래밍 방식 상세 이동, 소개 View, 사용자 정의 활동 View와 마지막 Catch-all Route를 구성했습니다.                                                                             | `src/router/index.js`, `App.vue`, `WeatherDetailView.vue`, `ActivityInsightView.vue` |
| Pinia                       | 완료           | `unit` state, `unitSymbol` getter, `toggleUnit` action과 Navbar 옆 `UnitToggler`를 구현했습니다. 추가 Store에서 활동·즐겨찾기·최근 검색·마지막 도시를 관리하고 직접 `localStorage`에 저장합니다.                                        | `configStore.js`, `preferenceStore.js`, `UnitToggler.vue`, `useTemperature.js`       |
| Axios                       | 완료           | OpenWeather Current Weather와 5 Day / 3 Hour Forecast, Open-Meteo Air Quality를 Axios 서비스로 분리했습니다. 로딩·오류·빈 상태·부분 실패·요청 취소와 최신 요청 우선 처리를 제공합니다.                                                  | `src/services/`, `useWeatherData.js`                                                 |
| UI Library                  | 완료           | Element Plus의 Card, Input, Select, Button, Tag, Progress, Skeleton, Alert, Empty와 Message를 실제 검색·상태·피드백 UX에 적용했습니다.                                                                                                  | `src/components/exercise/`, 각 Weather View                                          |
| Build & Deployment          | 완료           | format, lint, test와 production build가 성공했고 Vercel Production 배포와 SPA 직접 경로 접근을 확인했습니다.                                                                                                                          | `package.json`, `vercel.json`, Vercel 배포 주소                                      |

## 기술 스택

- Vue 3 Composition API와 `<script setup>`
- Vite
- JavaScript
- Vue Router
- Pinia
- Axios
- Element Plus
- ESLint, Oxlint, Prettier
- Node.js 내장 Test Runner

## 프로젝트 구조

```text
src/
├── assets/
│   └── main.css                 # 전역 토큰, reset, 기본 typography
├── components/
│   ├── exercise/                # WeatherFit UI 컴포넌트
│   └── practices/               # 기존 Vue 문법 학습 컴포넌트
├── composables/
│   ├── useActivityScore.js      # 활동 적합도 계산 규칙과 순수 함수
│   ├── useTemperature.js        # 섭씨·화씨 변환
│   └── useWeatherData.js        # API 상태와 빠른 요청 전환 처리
├── data/
│   └── cities.js                # 도시 ID, 한글·영문명, 위도·경도, 데모 데이터
├── router/
│   └── index.js                 # Lazy Loading Route 구성
├── services/
│   ├── weatherApi.js            # OpenWeather Axios 요청
│   ├── airQualityApi.js         # Open-Meteo Axios 요청
│   └── weatherService.js        # 병렬 요청, 정규화, 오류·데모 처리
├── stores/
│   ├── configStore.js           # 온도 단위와 갱신 시각
│   └── preferenceStore.js       # 활동, 즐겨찾기, 검색과 마지막 도시
├── views/                       # 홈, 상세, 활동, 소개, Not Found View
├── App.vue                      # Navbar, RouterView, 공통 앱 셸
└── main.js                      # Vue, Router, Pinia, Element Plus 등록
```

## 주요 Route

| 경로                | View                      | 설명                            |
| ------------------- | ------------------------- | ------------------------------- |
| `/`                 | `WeatherHomeView.vue`     | 도시 검색, 날씨 카드와 즐겨찾기 |
| `/weather/:cityId`  | `WeatherDetailView.vue`   | 선택 도시 상세 날씨와 예보      |
| `/activity/:cityId` | `ActivityInsightView.vue` | 도시·활동별 적합도 분석         |
| `/about`            | `WeatherAboutView.vue`    | 프로젝트와 데이터 출처 안내     |
| `/:pathMatch(.*)*`  | `NotFoundView.vue`        | 정의되지 않은 주소 안내         |

모든 View Route는 동적 import로 등록했습니다. 잘못된 도시 ID는 빈 화면 대신 오류 안내와 대시보드 이동 버튼을 표시합니다.

## 상태 관리 구조

### configStore

- `unit`: `celsius` 또는 `fahrenheit`. 기본값은 `celsius`이며 변경한 단위는 `weatherfit-unit` 키로 `localStorage`에 저장합니다.
- `unitSymbol`, `unitLabel`: 단위 표시 getter
- `toggleUnit()`: 온도 단위 변경
- `lastUpdatedAt`, `markUpdated()`: 마지막 갱신 시각 기록

### preferenceStore

- `selectedActivity`: 선택한 러닝·산책·자전거 활동
- `favoriteCityIds`: 즐겨찾기 도시 ID 목록
- `recentSearches`: 최대 5개의 최근 검색어
- `lastCityId`: 마지막으로 선택한 도시
- `isFavorite()`, `setActivity()`, `toggleFavorite()`, `addRecentSearch()`, `clearRecentSearches()`, `setLastCity()`
- 활동·즐겨찾기·최근 검색·마지막 도시는 `weatherfit-preferences` 키로 `localStorage`에 저장합니다.

## API 데이터 흐름

```text
도시 선택 또는 Route 변경
        ↓
useWeatherData / WeatherHomeView
        ↓
weatherService
        ├── 홈 목록 → OpenWeather 현재 날씨 + Open-Meteo 대기질
        └── 상세·활동 → 현재 날씨 + 3시간 예보 + 대기질
        ↓
API 응답 정규화
        ↓
currentWeather / forecast / airQuality / lastUpdatedAt
        ↓
날씨 카드·상세·예보·활동 적합도 컴포넌트
```

홈 목록에서는 사용하지 않는 예보를 도시마다 중복 요청하지 않습니다. 상세·활동 화면은 새 도시를 요청하기 전에 이전 결과를 초기화합니다. `AbortController`와 요청 ID를 함께 사용하여 빠르게 도시를 전환했을 때 이전 응답이 최신 화면을 덮어쓰지 않도록 처리합니다. 현재 날씨 요청은 필수 데이터로 취급하고, 예보 또는 대기질만 실패하면 성공한 데이터는 유지하면서 별도 경고를 표시합니다.

## 환경변수 설정 방법

저장소의 `.env.example`을 복사하여 `.env.local`을 생성합니다.

```sh
cp .env.example .env.local
```

`.env.local`에 발급받은 OpenWeather API Key를 입력합니다.

```dotenv
VITE_OPENWEATHER_API_KEY=your_api_key
```

실제 Key가 포함된 `.env.local`과 `.env.*.local` 파일은 `.gitignore`의 `*.local` 규칙으로 Git에서 제외했습니다. Key가 없으면 실제 API 요청 결과처럼 숨기지 않고 환경변수 안내와 데모 데이터 표식을 표시합니다.

`VITE_` 환경변수는 빌드된 브라우저 코드에서 읽을 수 있으므로 실제 Key를 저장소에 기록하지 않고 OpenWeather 사용량 제한도 함께 관리해야 합니다.

## 설치 및 실행 방법

```sh
npm install
npm run dev
```

개발 서버가 안내하는 로컬 주소에서 애플리케이션을 확인합니다.

프로덕션 결과물을 로컬에서 확인하려면 다음 명령을 사용합니다.

```sh
npm run build
npm run preview
```

## 품질 확인 명령어

```sh
npm run format
npm run lint
npm run test
npm run build
```

- `format`: `src/`의 Vue, JavaScript와 CSS를 Prettier로 정리합니다.
- `lint`: Oxlint와 ESLint 검사를 실행하고 수정 가능한 항목을 반영합니다.
- `test`: 활동 점수와 추천 시간, API 정규화, 오류 상태와 빠른 요청 전환 테스트를 실행합니다.
- `build`: Vite production build를 생성합니다.

## 직접 추가한 Customization

교재 필수 항목과 구분할 수 있도록 추가로 구현한 내용을 정리했습니다.

| 개인 추가 내용             | 구현 내용                                                                                                                                                                                                                 | 코드 근거                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| WeatherFit 활동 적합도     | 러닝·산책·자전거마다 적정 기온과 풍속 기준을 다르게 적용하고, 기온·습도·바람·강수·US AQI를 이용해 0~100점을 계산합니다. 점수뿐 아니라 등급, 감점 이유와 추천 문장을 함께 보여 줍니다.                                     | `useActivityScore.js`, `ActivityScoreCard.vue`, `ActivitySelector.vue`, `ActivityInsightView.vue` |
| 시간대별 활동 추천         | 화면에 표시하는 3시간 단위 예보마다 같은 활동 점수를 계산하고 가장 높은 점수의 시간을 추천합니다. 동점이면 더 이른 시간을 선택하며, 예보 시점의 날씨와 현재 AQI를 사용했다는 기준을 화면에 명시합니다.                    | `findBestActivityForecast()`, `BestActivityTimeCard.vue`, `ActivityInsightView.vue`               |
| 대기질 결합                | OpenWeather 날씨·예보에 Open-Meteo의 US AQI와 PM2.5를 결합해 활동 판단에 반영하고, 색상뿐 아니라 상태 문구와 기호도 표시합니다.                                                                                           | `airQualityApi.js`, `weatherService.js`, `AirQualityBadge.vue`                                    |
| 도시 메타데이터 확장       | 교재의 서울·수원·부산 외에 광주를 추가하고, 한글 검색명·영문 API 이름·위도·경도를 한곳에서 관리합니다. API 요청은 도시명 문자열 대신 좌표를 사용합니다.                                                                   | `cities.js`, `SearchBar.vue`, `WeatherHomeView.vue`                                               |
| 사용자 선호와 최근 검색 UI | 활동 종류, 즐겨찾기 도시, 최근 검색어와 마지막 선택 도시를 추가 Pinia Store에서 관리하고 외부 persisted-state 플러그인 없이 `localStorage`에 저장합니다. 최근 검색어는 태그로 다시 선택하거나 한 번에 삭제할 수 있습니다. | `preferenceStore.js`, `FavoriteCities.vue`, `RecentSearches.vue`                                  |
| 날씨 문구 정규화           | OpenWeather의 condition code를 기준으로 그룹 상태와 상세 설명을 분리하여 `온흐림 · 온흐림`, `실 비` 같은 중복·번역체 문구를 `흐림 · 매우 흐림`, `비 · 약한 비`처럼 표시합니다.                                            | `weatherService.js`, `WeatherCard.vue`, `WeatherDetailView.vue`                                   |
| 단위 변환 공통화           | 홈·상세·활동 화면이 같은 섭씨/화씨 설정을 사용하도록 변환 로직을 composable로 분리하고 선택한 단위를 `localStorage`에 저장합니다.                                                                                         | `configStore.js`, `useTemperature.js`, `UnitToggler.vue`                                          |
| API 장애 대응과 데모 모드  | API Key가 없을 때 실제 응답처럼 숨기지 않고 환경변수 안내와 `데모 데이터` 표식을 표시합니다. 현재 날씨는 필수로 처리하되 예보나 대기질만 실패하면 성공한 내용은 유지하고 경고합니다.                                      | `weatherService.js`, `useWeatherData.js`, 각 Weather View                                         |
| 빠른 도시 전환 보호        | 도시를 연속으로 바꿀 때 이전 응답이 최신 화면을 덮어쓰지 않도록 `AbortController`와 요청 ID를 함께 사용하고, 새 요청 전에 이전 도시 데이터를 초기화합니다.                                                                | `useWeatherData.js`, `WeatherHomeView.vue`                                                        |
| 반응형·접근성 UI           | 320px 화면부터 대응하는 레이아웃, 키보드로 선택 가능한 카드, label·ARIA 상태, 본문 바로가기와 `focus-visible`을 추가했습니다. 로딩·오류·빈 상태는 Skeleton·Alert·Empty로 구분합니다.                                      | `App.vue`, `WeatherCard.vue`, `SearchBar.vue`, 각 scoped style                                    |
| 검증 가능한 구조           | 활동 점수, API 정규화, 부분 실패와 빠른 요청 전환을 Node.js 내장 Test Runner로 검증하고 Vercel 직접 경로 접근용 SPA rewrite를 추가했습니다.                                                                               | `tests/`, `vercel.json`, `package.json`                                                           |

기존 Vue 문법 학습용 컴포넌트와 `AppPractice.vue`는 종합과제 코드와 분리해 뒀습니다.

## 오류 처리 방식

- API 요청 중에는 이전 도시 데이터를 초기화하고 Skeleton을 표시합니다.
- 네트워크 오류, 시간 초과, 잘못된 API Key, 도시 없음, 요청 한도 초과를 사용자용 문구로 변환합니다.
- 오류 Alert에 재시도 버튼을 제공합니다.
- 검색 결과, 예보 또는 도시 데이터가 없으면 Empty 상태를 표시합니다.
- API Key가 없으면 환경변수 설정 안내와 데모 데이터 표식을 표시합니다.
- 예보나 대기질만 실패한 경우 현재 날씨 화면을 유지하고 부분 실패 경고를 표시합니다.
- 취소된 요청은 사용자 오류로 표시하지 않으며 최신 요청만 상태를 변경합니다.

## 사용 범위와 참고 사항

- OpenWeather의 실제 현재 날씨와 예보는 유효한 API Key와 네트워크 연결이 필요합니다.
- 지원 도시는 `src/data/cities.js`에 등록된 서울·수원·부산·광주로 제한됩니다.
- 단기 예보는 OpenWeather 3시간 간격 응답 중 최대 8개 항목을 표시합니다.
- 활동 추천 시간의 대기질은 시간대별 AQI 예보가 아니라 현재 Open-Meteo AQI를 공통 기준으로 사용합니다.
- 활동 적합도는 개인의 건강 상태, 노면 상태, 재난 경보와 미세 기상 조건을 고려하지 않습니다.

---

## 기존 학습 기록

# WeatherFit Insight

WeatherFit Insight는 도시별 날씨와 대기질을 확인하고, 러닝·산책·자전거 활동의 적합도를 0~100점으로 확인할 수 있는 Vue 3 날씨 대시보드입니다. SKALA Vue.js 교재의 파란색 Hands on 과제를 하나의 앱으로 연결했습니다.

> 활동 적합도는 기온, 습도, 풍속, 강수, US AQI를 기반으로 계산한 **교육용 휴리스틱**입니다. 의학적·안전상의 판단을 대체하지 않습니다.

## 주요 기능

- 한글 도시 검색, 도시 선택 상태, 날씨 상세 라우팅
- OpenWeather Current Weather API의 현재 날씨와 5 Day / 3 Hour Forecast API의 단기 예보
- Open-Meteo Air Quality API의 US AQI와 PM2.5
- 섭씨/화씨 전환, 즐겨찾기 도시, 활동 종류를 Pinia와 localStorage로 관리
- 날씨 요소별 감점 사유와 추천 문구를 포함한 활동 적합도
- 로딩, 오류, 빈 결과 상태와 모바일/데스크톱 반응형 UI

API Key가 없으면 샘플 데이터 모드로 실행되며, API Key를 설정하면 실제 날씨·예보·대기질 데이터를 요청합니다.

## API 선택과 데이터 출처

- 현재 날씨: [OpenWeather Current Weather API](https://openweathermap.org/current)
- 단기 예보: [OpenWeather 5 Day / 3 Hour Forecast API](https://openweathermap.org/forecast5)
- 대기질: [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (원자료: CAMS)

도시명 기반 요청 대신 각 도시의 위도·경도를 사용합니다. OpenWeather API Key가 없으면 화면에 **환경변수 설정이 필요합니다.** 안내와 **데모 데이터** 표시를 함께 노출합니다. Open-Meteo 데이터 사용 시 출처 표기가 필요하며, 이용 목적에 따라 해당 서비스의 라이선스와 요금 정책을 확인해야 합니다.

## 활동 적합도 계산 기준

점수는 100점에서 시작하며 아래 기준으로 감점한 뒤 `0~100` 범위로 제한합니다.

| 조건             | 기준                                    | 감점                              |
| ---------------- | --------------------------------------- | --------------------------------- |
| 활동별 적정 기온 | 러닝 8~20℃, 산책 5~25℃, 자전거 10~24℃   | 범위를 벗어난 1℃당 3점, 최대 30점 |
| 습도             | 30% 미만 / 80% 초과                     | 8점 / 15점                        |
| 활동별 풍속      | 러닝 8m/s, 산책 10m/s, 자전거 6m/s 초과 | 초과 1m/s당 3점, 최대 24점        |
| 비               | 비가 오거나 강수량이 0보다 큼           | 기본 22점 + 강수량 반영 최대 8점  |
| 눈               | 눈이 옴                                 | 기본 30점 + 강수량 반영 최대 8점  |
| US AQI           | 51~100 / 101~150 / 151 이상             | 10점 / 25점 / 35점                |

등급은 85점 이상 `매우 좋음`, 70점 이상 `좋음`, 50점 이상 `보통`, 그 미만은 `나쁨`입니다. 이 계산은 학습을 위해 만든 설명 가능한 **활동 편의도 휴리스틱**이며, 의학적 조언이나 야외 활동의 안전을 보장하는 기준이 아닙니다.

## 실행 방법

```sh
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`의 `VITE_OPENWEATHER_API_KEY`에 [OpenWeather](https://openweathermap.org/) API Key를 입력합니다. `.env.local`과 `.env.*.local`은 `.gitignore`의 `*.local` 규칙으로 Git에 포함되지 않습니다. `.env.example`에는 예시 값만 있습니다.

## 품질 확인과 빌드

```sh
npm run format
npm run lint
npm run build
npm run preview
```

## 배포 환경 설정

- Vercel, Netlify 등의 배포 환경에 `VITE_OPENWEATHER_API_KEY`를 비밀 환경변수로 등록합니다.
- Vue Router가 HTML5 history 모드를 사용하므로 `/weather/seoul`, `/activity/seoul` 같은 경로를 직접 열거나 새로고침해도 `index.html`로 응답하도록 호스팅 서비스의 SPA rewrite/fallback을 설정해야 합니다.
- Vercel Production 환경에 배포했으며, 홈·상세·활동·소개 Route의 직접 접근과 새로고침을 확인했습니다.

## 단원별 Customization

- **Weather Mockup / Composition API:** 광주 도시와 습도·풍속·강수·대기질 데이터를 추가했고, 한글 검색·선택 상태·평균 기온 computed를 구현했습니다.
- **Vue Components:** `BaseDashboardCard`, `SearchBar`, `WeatherCard`에 더해 즐겨찾기, 활동 선택, 적합도, 대기질, 예보 컴포넌트로 기능을 분리했습니다.
- **Vue Router:** 모든 View에 Lazy Loading을 적용하고 동적 도시 상세, 소개, 사용자 정의 활동 인사이트, Catch-all 화면을 연결했습니다.
- **Pinia:** 섭씨/화씨 전환과 마지막 갱신 시각을 `configStore`에, 즐겨찾기·활동·최근 검색·마지막 도시를 `preferenceStore`에 구현했습니다.
- **Axios / API:** 현재 날씨, 3시간 예보, 대기질 API를 `services`로 분리하고 응답을 화면용 모델로 정규화했습니다.
- **UI Library:** Element Plus의 Input, Select, Card, Tag, Progress, Loading, Alert, Empty, Message를 검색·상태 표시·피드백에 적용했습니다.
- **개인화:** 활동별 적정 기온과 풍속 기준을 다르게 두고, 날씨·대기질 감점 사유와 행동 추천을 함께 표시했습니다.

---

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

## 1일차 요점만 정리

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

## 2일차

Vue Directive의 나머지 문법과 이벤트 처리, 폼 입력, Weather Mockup, Composition API를 공부했다. 단순히 화면에 값을 출력하는 것에서 끝나는 게 아니라, 사용자의 입력과 상태 변화에 따라 화면이 어떻게 달라지는지 확인했다.

## 조건에 따라 화면 바꾸기

### v-if와 v-show

`v-if`는 조건이 거짓이면 HTML 요소 자체를 만들지 않는다. `v-else-if`, `v-else`와 같이 여러 조건을 나눌 수도 있다.

`v-show`는 요소를 만든 뒤 CSS의 `display`를 바꿔서 보이거나 숨긴다. 자주 켰다 껐다 해야 하는 화면은 `v-show`, 조건이 바뀌는 일이 적은 화면은 `v-if`를 쓰는 방법이 있다.

```vue
<script setup>
import { ref } from 'vue'

const temperature = ref(26)
const showGuide = ref(true)
</script>

<template>
  <p v-if="temperature >= 30">더운 날씨입니다.</p>
  <p v-else-if="temperature >= 20">활동하기 무난한 날씨입니다.</p>
  <p v-else>겉옷을 챙기는 게 좋습니다.</p>

  <p v-show="showGuide">기온은 관측 시점에 따라 달라질 수 있습니다.</p>
</template>
```

## 목록 반복하기

`v-for`는 배열이나 객체의 내용을 반복해서 화면에 만든다. 이때 Vue가 각 항목을 구분할 수 있도록 `:key`를 같이 써야 한다. 배열 순서가 바뀔 수 있는 목록에서는 index보다 데이터가 가진 고유한 id를 key로 쓰는 게 안전하다.

```vue
<ul>
  <li v-for="city in weatherList" :key="city.id">
    {{ city.name }} / {{ city.temperature }}℃
  </li>
</ul>
```

## 이벤트 처리

`v-on`은 클릭이나 키 입력 같은 사용자 이벤트를 받는다. 실무에서는 축약형인 `@`를 주로 쓴다.

- `@click="count++"`: 짧은 식을 템플릿에서 바로 실행
- `@click="handleClick"`: script에 만든 함수를 연결
- `$event`: 발생한 이벤트 객체를 함수에 같이 전달
- `.prevent`: form 제출이나 링크 이동 같은 기본 동작을 막음
- `.stop`: 자식의 클릭 이벤트가 부모로 올라가는 버블링을 막음
- `.once`: 이벤트를 한 번만 실행
- `.enter`: Enter 키를 눌렀을 때 실행

Weather Card에서는 카드 전체를 눌렀을 때 도시를 선택하고, 상세보기 버튼을 눌렀을 때는 다른 동작을 해야 한다. 상세보기 버튼에 `.stop`을 붙이면 두 이벤트가 한꺼번에 실행되는 걸 막을 수 있다.

```vue
<article @click="selectCity(city.id)">
  <h3>{{ city.name }}</h3>
  <button type="button" @click.stop="openDetail(city.id)">상세보기</button>
</article>
```

## v-model과 입력값

`v-model`은 input의 값과 Vue의 반응형 데이터를 양방향으로 연결한다. 사용자가 입력하면 ref 값이 바뀌고, ref 값을 코드에서 바꾸면 input에도 반영된다.

```vue
<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <label for="city-search">도시 검색</label>
  <input id="city-search" v-model.trim="searchQuery" placeholder="도시 이름을 입력하세요" />
  <p>검색어: {{ searchQuery }}</p>
</template>
```

`.trim`을 붙이면 입력값 앞뒤의 공백을 정리해서 받을 수 있다. `v-model`은 내부적으로 `:value`와 `@input`을 묶어서 쓰기 쉽게 만든 문법이라고 이해했다.

## Composition API

Composition API는 화면에 필요한 상태와 함수를 기능별로 모아 작성하는 방식이다. 이번 프로젝트에서는 Vue 3의 `<script setup>` 문법을 사용했다.

### ref와 reactive

`ref()`는 문자열, 숫자, Boolean 같은 한 개의 값뿐 아니라 배열이나 객체에도 사용할 수 있다. script에서 값을 읽거나 바꿀 때는 `.value`가 필요하지만 template에서는 Vue가 자동으로 풀어주기 때문에 `.value`를 쓰지 않는다.

`reactive()`는 객체나 배열 자체를 반응형으로 만든다. 다만 reactive 객체를 일반 구조 분해 할당하면 반응성 연결이 끊길 수 있어서 주의해야 한다.

```javascript
import { reactive, ref } from 'vue'

const searchQuery = ref('')
const selectedCityId = ref('seoul')

const weatherList = reactive([
  { id: 'seoul', name: '서울', temperature: 27 },
  { id: 'busan', name: '부산', temperature: 25 },
  { id: 'jeju', name: '제주', temperature: 24 },
])
```

### computed

`computed()`는 기존 반응형 데이터를 이용해 새로운 값을 계산한다. 관련된 값이 바뀔 때만 다시 계산하고 결과를 저장해두기 때문에, 같은 계산을 template에서 계속 반복하는 것보다 관리하기 쉽다.

```javascript
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim().toLocaleLowerCase('ko-KR')

  if (!keyword) return weatherList

  return weatherList.filter((city) => city.name.toLocaleLowerCase('ko-KR').includes(keyword))
})
```

검색어가 비어 있으면 원래 목록 전체를 반환하고, 검색어가 있으면 한글 도시 이름에 포함되는 항목만 반환하도록 했다.

### watch와 watchEffect

`watch()`는 지정한 반응형 값이 바뀌었을 때 실행한다. 이전 값과 바뀐 값을 구분해야 하거나, 특정 상태만 골라 감시할 때 알맞다.

`watchEffect()`는 함수 안에서 사용한 반응형 값을 Vue가 알아서 추적하고 처음부터 한 번 실행한다. 어떤 값을 의존하고 있는지 한눈에 보이는 짧은 반응 로직에 사용했다.

```javascript
watch(selectedCityId, (cityId) => {
  const city = weatherList.find((item) => item.id === cityId)
  selectedStatus.value = city ? `선택한 도시: ${city.name}` : '선택 도시 없음'
})

watchEffect(() => {
  searchStatus.value = searchQuery.value.trim()
    ? `검색 결과 ${filteredWeatherList.value.length}건`
    : '전체 도시를 표시하고 있습니다.'
})
```

직접 다시 볼 수 있도록 `src/components/practices/composition/CompositionPractice.vue`에 ref, reactive, computed, watch, watchEffect를 한 화면에 묶어 뒀다. 한글 검색, 고유 id key, 선택 상태, 검색 결과 없음까지 같이 확인할 수 있다.

## 2일차 요점만 정리

- `v-if / v-else-if / v-else`: 조건에 맞는 요소만 실제로 렌더링
- `v-show`: 요소는 유지하고 CSS로 표시 여부를 변경
- `v-for`와 `:key`: 배열을 반복해서 그리고, 고유 id로 각 항목을 구분
- `v-on` 또는 `@`: 클릭, 입력, 키보드 같은 이벤트 처리
- `.stop / .prevent`: 이벤트 버블링과 브라우저 기본 동작을 제어
- `v-model`: input과 반응형 데이터를 양방향으로 연결
- `ref / reactive`: 값, 객체, 배열을 반응형 상태로 관리
- `computed`: 반응형 값을 바탕으로 계산한 결과를 캐싱
- `watch / watchEffect`: 상태가 달라질 때 필요한 작업을 실행

## 3일차

146페이지부터 197페이지까지 Vue Components와 Vue Router를 공부했다. 한 파일에 모든 코드를 넣는 방식에서 벗어나 화면을 작은 부품으로 나누고, URL에 맞춰 페이지를 교체하는 방법을 정리했다.

## Vue Components

컴포넌트는 화면을 역할별로 나눈 `.vue` 파일이다. 부모 컴포넌트가 데이터와 상태를 관리하고, 자식 컴포넌트는 전달받은 내용을 화면에 보여주거나 사용자 이벤트를 부모에게 알리는 구조로 만들 수 있다.

현재 WeatherFit 화면도 다음처럼 나눴다.

```text
WeatherHomeView.vue
├── SearchBar.vue
├── StatusBar.vue
├── WeatherCard.vue
│   └── BaseDashboardCard.vue
└── EmptyState.vue
```

### 컴포넌트 등록

`<script setup>`에서 컴포넌트를 import하면 template에서 바로 사용할 수 있다. 특정 부모 안에서만 쓰는 컴포넌트는 이렇게 지역 등록하는 게 어떤 파일에서 사용하는지 확인하기 쉽다.

```vue
<script setup>
import PracticeCityItem from './PracticeCityItem.vue'
</script>

<template>
  <PracticeCityItem />
</template>
```

### props와 emits

props는 부모가 자식에게 데이터를 내려주는 통로다. 자식이 props를 직접 바꾸지 않고, 바꿔야 할 일이 생기면 emits로 부모에게 알려준다.

```vue
<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },
})

defineEmits(['select-city', 'open-detail'])
</script>

<template>
  <button type="button" @click="$emit('select-city', city.id)">{{ city.name }} 선택</button>
</template>
```

부모에서는 `:city="city"`로 값을 내려주고 `@select-city="handleSelect"`로 자식이 올린 이벤트를 받는다. JavaScript에서는 camelCase를 쓰고, template 이벤트 이름은 `select-city`처럼 kebab-case로 작성하면 구분하기 쉽다.

### slot

slot은 공통 레이아웃 안쪽의 내용을 사용하는 쪽에서 채울 수 있게 만든 자리다. 카드의 테두리와 여백은 공통으로 두고 제목이나 본문만 다르게 넣을 때 사용할 수 있다.

```vue
<template>
  <section class="practice-panel">
    <header>
      <slot name="title">기본 제목</slot>
    </header>
    <slot />
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
```

`src/components/practices/components` 폴더에 부모, 자식, 공통 slot 컴포넌트를 따로 작성했다. `PracticeCityItem.vue`는 props와 emits, `PracticePanel.vue`는 기본 slot과 named slot, `ComponentPractice.vue`는 상태 관리와 lifecycle hook을 확인하는 예제다.

### Lifecycle Hook

컴포넌트도 만들어지고 화면에 붙고, 값이 바뀌고, 화면에서 사라지는 순서가 있다.

- `onMounted`: 컴포넌트가 DOM에 연결된 다음 실행
- `onUpdated`: 반응형 값 변화로 DOM이 갱신된 다음 실행
- `onUnmounted`: 컴포넌트가 사라질 때 실행. timer나 event listener 정리에 사용

무조건 hook을 많이 쓰는 게 아니라 DOM 접근이나 외부 자원 정리처럼 실제로 필요한 시점에 사용해야 한다.

## Vue Router

Router는 URL과 View 컴포넌트를 연결한다. 1일차에는 기본 흐름을 봤고, 이번에는 동적 Route와 Lazy Loading, 코드에서 이동하는 방법까지 확인했다.

```javascript
const routes = [
  {
    path: '/',
    name: 'weather-home',
    component: () => import('@/views/WeatherHomeView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('@/views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
```

### Lazy Loading

`import View from '...'`처럼 처음부터 가져오지 않고 `() => import('...')`로 등록하면 해당 Route에 들어갈 때 파일을 불러온다. 처음 화면에 필요하지 않은 페이지까지 한꺼번에 받지 않아도 된다.

### Dynamic Route와 useRoute

`/weather/:cityId`의 `:cityId`는 도시마다 달라지는 값이다. `/weather/seoul`이면 `route.params.cityId`는 `seoul`이 된다.

```javascript
import { useRoute } from 'vue-router'

const route = useRoute()
const cityId = computed(() => String(route.params.cityId ?? ''))
```

URL에서 받은 값은 사용자가 직접 바꿀 수도 있으므로, 도시 목록에 없는 id인지 확인하고 안내 화면을 보여줘야 빈 화면이 생기지 않는다.

### useRouter와 Programmatic Navigation

사용자가 버튼을 눌렀거나 데이터 저장이 끝났을 때 코드에서 이동하려면 `useRouter()`를 사용한다.

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

const openDetail = (cityId) => {
  router.push({ name: 'weather-detail', params: { cityId } })
}
```

- `router.push()`: 새 주소로 이동하고 방문 기록을 남김
- `router.replace()`: 현재 방문 기록을 새 주소로 교체
- `router.go(-1)`: 브라우저 뒤로 가기와 같은 이동

### RouterLink, RouterView, Catch-all

`RouterLink`는 SPA 안에서 이동하는 링크이고, `RouterView`는 현재 URL에 맞는 View가 들어가는 자리다. 등록한 주소와 맞지 않는 URL은 routes 배열 마지막의 Catch-all Route에서 받아 Not Found 화면을 보여준다.

## 3일차 요점만 정리

- Component: 화면을 역할별 `.vue` 파일로 나눈 재사용 가능한 부품
- props: 부모가 자식에게 데이터를 내려줌
- emits: 자식이 부모에게 이벤트와 필요한 값을 올림
- slot: 공통 컴포넌트 안에 사용할 쪽의 내용을 넣는 자리
- Lifecycle Hook: 컴포넌트가 연결되고 갱신되고 사라지는 시점에 필요한 작업 실행
- Lazy Loading: 해당 Route에 들어갈 때 View 파일을 불러옴
- Dynamic Route: `/weather/:cityId`처럼 URL 일부를 값으로 사용
- `useRoute / useRouter`: 현재 주소 정보를 읽거나 코드에서 다른 Route로 이동
- Catch-all Route: 등록되지 않은 주소를 Not Found 화면으로 처리

## 4일차

Pinia부터 Axios, UI Library, Vite 빌드와 배포 준비까지 공부했다. 화면 안에만 있던 상태를 Store로 옮기고, 외부 API 데이터를 받아 사용자에게 보여준 뒤 배포 가능한 파일로 만드는 흐름이다.

## Pinia

컴포넌트가 여러 단계로 깊어지면 props와 emits만으로 같은 상태를 계속 전달하기 불편해진다. Pinia Store를 사용하면 여러 컴포넌트가 공통 상태를 직접 읽고 action을 호출할 수 있다.

Pinia Store의 기본 구성은 다음 세 가지다.

- `state`: Store에서 관리하는 반응형 데이터
- `getters`: state를 이용해 계산한 값. 컴포넌트의 computed와 비슷함
- `actions`: state를 바꾸거나 여러 작업을 묶어서 처리하는 함수

```javascript
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: 'celsius',
  }),
  getters: {
    unitSymbol: (state) => (state.unit === 'celsius' ? '℃' : '℉'),
  },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
  },
})
```

`main.js`에서 `app.use(createPinia())`로 Pinia를 앱에 등록한 뒤 컴포넌트에서 Store를 사용한다. Store를 구조 분해 할당할 때 반응성을 유지해야 하는 state와 getter는 `storeToRefs()`로 꺼낸다. action은 Store에서 직접 호출할 수 있다.

```javascript
const configStore = useConfigStore()
const { unit, unitSymbol } = storeToRefs(configStore)

configStore.toggleUnit()
```

이 예제는 `src/components/practices/store/StorePractice.vue`에 따로 뒀다. 실제 앱에서는 `configStore.js`가 온도 단위를 관리하고, `preferenceStore.js`가 활동 종류, 즐겨찾기 도시, 최근 검색을 관리한다. 즐겨찾기 같은 값은 localStorage에도 저장해서 새로고침 뒤에도 남도록 했다.

## Axios와 외부 API

Axios는 브라우저에서 HTTP 요청을 보내고 응답을 받는 라이브러리다. `axios.get()`은 Promise를 반환하고, 현재 프로젝트에서는 `async/await`와 `try/catch`로 결과와 오류를 처리했다.

```javascript
const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

const response = await weatherClient.get('/weather', {
  params: {
    lat: city.latitude,
    lon: city.longitude,
    appid: apiKey,
    units: 'metric',
    lang: 'kr',
  },
})
```

긴 URL과 파라미터를 View마다 반복하지 않도록 API 호출은 `src/services` 폴더로 분리했다.

- `weatherApi.js`: OpenWeather 현재 날씨와 단기 예보 요청
- `airQualityApi.js`: Open-Meteo 대기질 요청
- `weatherService.js`: 여러 응답을 화면에서 쓰기 좋은 형태로 정리하고 오류 메시지 처리

API Key는 코드에 직접 적지 않고 `import.meta.env.VITE_OPENWEATHER_API_KEY`로 읽는다. 실제 키는 Git에 올라가지 않는 `.env.local`에 넣고, `.env.example`에는 변수 이름과 예시 값만 적어 뒀다.

네트워크 요청은 바로 결과가 오는 게 아니기 때문에 다음 상태를 따로 관리해야 한다.

- loading: 요청 중임을 skeleton이나 문구로 표시
- success: 받은 데이터를 화면에 표시
- error: 오류 원인과 재시도 버튼 표시
- empty: 요청은 끝났지만 표시할 데이터가 없는 상태

도시를 빠르게 바꾸면 먼저 보낸 요청이 나중에 도착할 수도 있다. 그래서 이전 요청을 취소하거나 마지막 요청인지 확인해서 다른 도시의 데이터가 섞이지 않도록 해야 한다.

## UI Library와 Element Plus

UI Library는 input, button, card, alert처럼 자주 쓰는 화면 요소를 미리 만든 컴포넌트 모음이다. 모든 HTML을 바꾸는 대신 사용자 경험이 실제로 좋아지는 부분에 Element Plus를 적용했다.

- `el-input`: 도시 검색
- `el-select`: 활동 종류 선택
- `el-card`: 날씨와 활동 점수 정보 묶음
- `el-progress`, `el-tag`: 활동 적합도 점수와 등급
- `el-skeleton`: API 요청 중 자리 표시
- `el-alert`: 오류 안내
- `el-empty`: 검색 결과나 데이터가 없을 때 안내
- `ElMessage`: 즐겨찾기 같은 짧은 작업 결과 안내

Element Plus의 CSS는 UI Library 전체에서 사용하는 전역 스타일이므로 `main.js`에서 한 번 import했다. 직접 만든 컴포넌트 CSS는 각 `.vue` 파일의 `<style scoped>`에 작성해서 다른 화면과 충돌하지 않게 했다.

## Vite 품질 검사와 빌드

개발 중에는 여러 `.vue`, JavaScript, CSS 파일을 사용하지만 배포할 때는 브라우저가 읽을 수 있도록 묶고 압축해야 한다. Vite에서 `npm run build`를 실행하면 결과가 `dist` 폴더에 만들어진다.

```bash
npm run format
npm run lint
npm run test
npm run build
npm run preview
```

- `format`: Prettier로 들여쓰기, 따옴표, 줄바꿈을 정리
- `lint`: ESLint와 Oxlint로 문법 오류, 사용하지 않는 변수, 좋지 않은 코드 패턴을 검사
- `test`: 활동 점수 계산과 데이터 변환 같은 로직 확인
- `build`: 배포용 정적 파일 생성
- `preview`: 만든 dist 결과를 로컬에서 실행해서 확인

Vite 환경변수 중 브라우저 코드에서 읽어야 하는 값은 `VITE_`로 시작해야 한다. 하지만 프론트엔드 환경변수는 최종 JavaScript에 포함될 수 있으므로, 저장소에 실제 Key를 올리지 않는 것과 API 제공자의 사용 제한을 같이 확인해야 한다.

Vue Router의 history 모드를 정적 호스팅에 배포할 때는 `/weather/seoul` 같은 주소를 직접 열어도 `index.html`로 연결되도록 SPA rewrite 설정이 필요하다. 이 프로젝트는 Vercel에서 사용할 `vercel.json`을 추가해 뒀다.

## 4일차 요점만 정리

- Pinia: 여러 컴포넌트가 같이 쓰는 상태를 Store에서 관리
- `state / getters / actions`: Store 데이터, 계산 값, 상태를 바꾸는 함수
- `storeToRefs`: Store의 state와 getter를 구조 분해해도 반응성을 유지
- Axios: HTTP 요청을 보내고 응답 데이터를 받는 라이브러리
- `async / await`, `try / catch`: 비동기 요청의 성공과 실패를 읽기 쉽게 처리
- 환경변수: API Key처럼 코드와 분리해야 하는 값을 관리. Vite에서는 `VITE_` 접두사 사용
- Element Plus: 검색, 카드, 로딩, 오류, 빈 상태 등 필요한 UI에 선택해서 적용
- `format / lint / build`: 코드 형식을 정리하고 오류를 검사한 뒤 배포용 dist 파일 생성
