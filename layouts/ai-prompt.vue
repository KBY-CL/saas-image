<!--
 * [AI 프롬프트 전용 레이아웃]
 * AI 프롬프트 작성, 관리, 실행에 최적화된 레이아웃
 * 깔끔한 헤더와 AI 프롬프트 작업에 집중할 수 있는 환경 제공
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-01-27 / 정우근 / - / 최초작성
 *     2. 2025-01-27 / 정우근 / - / 검은색 배경 및 헤더 테마 적용
 *     3. 2025-01-27 / 정우근 / - / primary 색상 제거 및 완전 검은색 통일
 *     4. 2025-01-27 / 정우근 / - / 헤더 색상을 검은회색(#424242)으로 변경
 *     5. 2025-01-27 / 정우근 / - / AI 로봇 아이콘과 AI 프롬프트 텍스트 제거
 -->

<template>
  <v-app>
    <!-- AI 프롬프트 전용 헤더 -->
    <v-app-bar app fixed class="custom-header" dark>
      <v-spacer />
      
      <v-sheet class="d-flex align-center" elevation="0">
        <v-img :src="resource.getPublic('cloudlab.png')" width="100" class="flex-shrink-0 mr-3" />

        <!-- 새로고침 및 새창 열기 메뉴 -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item @click="refresh">
              <template #prepend>
                <v-icon icon="mdi-refresh" />
              </template>
              <v-list-item-title>새로고침</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openNewWindow">
              <template #prepend>
                <v-icon icon="mdi-open-in-new" />
              </template>
              <v-list-item-title>새창으로 열기</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-sheet>
    </v-app-bar>

    <!-- 메인 컨텐츠 -->
    <v-main app class="ai-prompt-main">
      <NuxtPage />
    </v-main>

    <!-- 메시지 컴포넌트들 -->
    <MessageInfo v-model="messageInfoStore._vModel" :r-model="messageInfoStore.rModel" />
    <MessageConfirm v-model="messageConfirmStore._vModel" :r-model="messageConfirmStore.rModel" />
    <v-snackbar-queue v-model="snackbarStore._messages" location="bottom right"></v-snackbar-queue>
  </v-app>
</template>

<script setup lang="ts">
const messageInfoStore = useMessageInfoStore();
const messageConfirmStore = useMessageConfirmStore();
const snackbarStore = useSnackbarStore();

const resource = useResource();

// 새로고침
function refresh() {
  window.location.reload();
}

// 새창으로 열기
function openNewWindow() {
  window.open(window.location.href, '_blank');
}
</script>

<style scoped>
.ai-prompt-main {
  background-color: #000000;
  min-height: 100vh;
}

.custom-header {
  background-color: #424242 !important;
}

.v-app-bar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #424242 !important;
}

.v-app-bar-title {
  font-weight: 600;
}

/* 전체 앱 배경을 검은색으로 설정 */
:deep(.v-application) {
  background-color: #000000 !important;
}

/* 헤더 내부 요소들도 검은회색 테마로 통일 */
:deep(.v-app-bar) {
  background-color: #424242 !important;
}

:deep(.v-main) {
  background-color: #000000 !important;
}

/* 헤더 내부의 모든 요소들을 검은회색으로 강제 적용 */
:deep(.v-app-bar .v-toolbar__content) {
  background-color: #424242 !important;
}

:deep(.v-app-bar .v-toolbar__extension) {
  background-color: #424242 !important;
}

/* 헤더 내부의 모든 컴포넌트들을 검은회색으로 강제 적용 */
:deep(.v-app-bar .v-sheet) {
  background-color: transparent !important;
}

:deep(.v-app-bar .v-btn) {
  background-color: transparent !important;
}

:deep(.v-app-bar .v-menu) {
  background-color: transparent !important;
}

/* 헤더 텍스트와 아이콘 색상을 흰색으로 설정 */
:deep(.v-app-bar .v-icon) {
  color: white !important;
}

:deep(.v-app-bar .text-h6) {
  color: white !important;
}

:deep(.v-app-bar .v-list-item-title) {
  color: white !important;
}
</style>
