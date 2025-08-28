<!--
 * AI 이미지 분석 페이지 전용 레이아웃
 * 깔끔한 헤더와 AI 분석에 집중할 수 있는 환경 제공
 -->

<template>
  <v-app>
    <!-- 간단한 헤더 -->
    <v-app-bar app fixed>
      <v-spacer />
      
      <v-sheet class="d-flex align-center" elevation="0">
        <v-img :src="resource.getPublic('cloudlab.png')" width="120" class="flex-shrink-0 mr-3" />

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
    <v-main>
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
.v-app-bar-title {
  font-weight: 600;
}
</style>