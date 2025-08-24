<!--
 - [레이아웃]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-07-31 / 정우근 / - / 최초작성
 -->

<template>
  <v-app>
    <v-app-bar app fixed>
      <v-app-bar-nav-icon variant="text" @click.stop="isDrawerOpend = !isDrawerOpend"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ activePage?.name }}</v-app-bar-title>

      <v-sheet class="d-flex align-center" elevation="0">
        <v-img :src="resource.getPublic('cloudlab.png')" width="120" class="flex-shrink-0 mr-5" />

        <client-only>
          <v-tooltip text="위젯 추가" location="bottom" open-delay="500">
            <template #activator="{ props }">
              <v-btn icon="mdi-shape-square-plus" v-bind="props" @click="addWidget"></v-btn>
            </template>
          </v-tooltip>

          <v-tooltip text="저장" location="bottom" open-delay="500">
            <template #activator="{ props }">
              <v-btn icon="mdi-content-save" v-bind="props" @click="save"></v-btn>
            </template>
          </v-tooltip>
        </client-only>

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

    <client-only>
      <v-navigation-drawer v-model="isDrawerOpend" :location="$vuetify.display.mobile ? 'top' : undefined" temporary width="400">
        <v-list>
          <v-list-item v-for="page in pages" :key="page.pageId" :value="page" color="primary" variant="plain" :active="page.isActive" @click="goToPage(page.pageId, page.path)">
            <template #append>
              <v-menu location="bottom right">
                <template #activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>

                <v-list>
                  <v-list-item @click="openPageConfigDialog(page.pageId, page.name)">
                    <template #prepend>
                      <v-icon icon="mdi-cog" />
                    </template>
                    <v-list-item-title>페이지 설정</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deletePage(page.pageId)">
                    <template #prepend>
                      <v-icon icon="mdi-trash-can-outline" />
                    </template>
                    <v-list-item-title>페이지 삭제</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <v-list-item-title>{{ page.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-sheet class="pa-2">
          <v-btn block color="grey-darken-3" @click="addPage"> 페이지 추가 </v-btn>
        </v-sheet>
      </v-navigation-drawer>
    </client-only>

    <v-main app>
      <NuxtPage />
      <v-snackbar />
    </v-main>

    <MessageInfo v-model="messageInfoStore._vModel" :r-model="messageInfoStore.rModel" />
    <MessageConfirm v-model="messageConfirmStore._vModel" :r-model="messageConfirmStore.rModel" />
    <v-snackbar-queue v-model="snackbarStore._messages" location="bottom right"></v-snackbar-queue>

    <WidgetCommonSelectorDialog v-model="selectorDialogStore._vModel" :r-model="selectorDialogStore.rModel" />

    <PageConfigsDialog v-model="vModelOfPageConfigsDialog" :r-model="rModelOfPageConfigsDialog" />
  </v-app>
</template>

<script setup lang="ts">
import type { VModelType as VModelTypeOfPageConfigsDialog, RModelType as RModelTypeOfPageConfigsDialog, OnCloseResponseType as OnCloseResponseTypeOfPageConfigsDialog } from '~/components/PageConfigsDialog.vue';

const messageInfoStore = useMessageInfoStore();
const messageConfirmStore = useMessageConfirmStore();
const snackbarStore = useSnackbarStore();
const selectorDialogStore = useSelectorDialogStore();

const pageLogic = usePageLogic();

const pages = pageLogic.getPages();
const activePage = pageLogic.getActivePage();

const resource = useResource();

const isDrawerOpend = ref(false);

const vModelOfPageConfigsDialog = ref<VModelTypeOfPageConfigsDialog>({
  isOpen: false,
});

const rModelOfPageConfigsDialog = ref<RModelTypeOfPageConfigsDialog>({
  name: '',
  onClose: undefined,
});

function goToPage(aPageId: string, aPath: string) {
  if (aPath) {
    pageLogic.setActivePage(aPageId);
    pageLogic.saveWidgets();
    navigateTo(aPath);
  }
}

function addWidget() {
  pageLogic.addWidget();
}

function save() {
  pageLogic.saveWidgetsToServer();
}

function refresh() {
  pageLogic.refreshWidgets();
}

function openNewWindow() {
  window.parent.postMessage({ id: 'requestOpenNewWindowToSpage' }, window.location.origin);
}

function addPage() {
  vModelOfPageConfigsDialog.value.isOpen = true;
  rModelOfPageConfigsDialog.value.name = '';
  rModelOfPageConfigsDialog.value.onClose = callbackOnCloseOfAddPage;
}

async function callbackOnCloseOfAddPage(args: OnCloseResponseTypeOfPageConfigsDialog) {
  if (!args.isConfirmed) return;

  const newPage = pageLogic.addPage(args.name);

  pageLogic.setActivePage(newPage.pageId);
  navigateTo(newPage.path);
}

function deletePage(aPageId: string) {
  let nextPage;
  if (activePage.value?.pageId === aPageId) nextPage = Object.values(pages.value).find((p) => p.pageId !== aPageId);

  if (nextPage) {
    pageLogic.setActivePage(nextPage.pageId);
    navigateTo(nextPage.path);
  }

  pageLogic.deletePage(aPageId);
}

// [옵션 처리 Start]
function openPageConfigDialog(aPageId: string, aName: string) {
  vModelOfPageConfigsDialog.value.isOpen = true;
  rModelOfPageConfigsDialog.value.pageId = aPageId;
  rModelOfPageConfigsDialog.value.name = aName;
  rModelOfPageConfigsDialog.value.onClose = callbackOnCloseOfOpenPageConfigDialog;
}

function callbackOnCloseOfOpenPageConfigDialog(args: OnCloseResponseTypeOfPageConfigsDialog) {
  if (!args.isConfirmed) return;
  if (!args.pageId) return;

  pageLogic.changePageConfigs(args.pageId, args.name);
}
// [옵션 처리 End]
</script>

<style scoped>
.v-app-bar-title {
  font-weight: 600;
}
</style>
