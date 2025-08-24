<!--
 - [위젯 헤더 레이아웃 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <div>
    <v-sheet class="cll-handle position-sticky top-0 left-0 right-0">
      <v-toolbar color="grey-darken-3" density="compact">
        <v-toolbar-title class="text-subtitle-1">{{ widget?.name }}</v-toolbar-title>

        <v-menu location="bottom right">
          <template #activator="{ props: menuProps }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="menuProps"></v-btn>
          </template>

          <v-list>
            <v-list-item @click="openConfigDialog">
              <template #prepend>
                <v-icon icon="mdi-cog" />
              </template>
              <v-list-item-title>위젯 설정</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openSelectorDialog">
              <template #prepend>
                <v-icon icon="mdi-file-replace-outline" />
              </template>
              <v-list-item-title>위젯 변경</v-list-item-title>
            </v-list-item>
            <v-list-item @click="remove">
              <template #prepend>
                <v-icon icon="mdi-trash-can-outline" />
              </template>
              <v-list-item-title>위젯 삭제</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>

    <component :is="widgetConfigsComponent" v-model="vModelOfBasicConfigsDialog" />
  </div>
</template>

<script setup lang="ts">
import { COMPONENT_CONFIGS_MAP } from '~/components/widget/mapper';
import { PAGE, WIDGET } from '~/keys/provider';
import type { VModelType as VModelTypeOfBasicConfigsDialog } from '~/components/widget/common/BasicConfigsDialog.vue';

const pageLogic = usePageLogic();
const messageLogic = useMessageLogic();
const widgetSelectorLogic = useWidgetSelectorLogic();

const page = inject<ComputedRef<Readonly<PageType>>>(PAGE);
const widget = inject<ComputedRef<Readonly<WidgetType>>>(WIDGET);

// [위젯 설정 Start]
const widgetConfigsComponent = COMPONENT_CONFIGS_MAP[widget?.value.componentId as ComponentConfigsMapKeyType]
  ? ref(markRaw(COMPONENT_CONFIGS_MAP[widget?.value.componentId as ComponentConfigsMapKeyType]))
  : ref(markRaw(COMPONENT_CONFIGS_MAP['Basic']));

const vModelOfBasicConfigsDialog = ref<VModelTypeOfBasicConfigsDialog>({
  isOpen: false,
});

function openConfigDialog() {
  vModelOfBasicConfigsDialog.value.isOpen = true;
}
// [위젯 설정 End]

// [위젯 변경 Start]
function openSelectorDialog() {
  widgetSelectorLogic.show(widget?.value.componentId, callbackOnCloseOfSelectorDialog);
}

function callbackOnCloseOfSelectorDialog(abConfirmed: boolean, aSelectedComponentId: ComponentMapKeyType, aName: string, aisConfigurable: boolean) {
  if (!abConfirmed) return;
  if (!widget?.value.widgetId || !aSelectedComponentId || !aName) return;

  pageLogic.changeWidget(widget.value.widgetId, aSelectedComponentId, aName, aisConfigurable);
}
// [위젯 변경 End]

// [위젯 삭제 Start]
function remove() {
  messageLogic.showConfirmDialog('삭제 전 확인', '위젯을 삭제하시겠습니까?', false, callbackOnCloseOfRemoveDialog);
}

function callbackOnCloseOfRemoveDialog(abConfirmed: boolean) {
  if (!abConfirmed) return;
  if (!widget?.value.widgetId) return;

  pageLogic.deleteWidget(widget.value.widgetId);
}
// [위젯 삭제 End]
</script>

<style scoped>
.cll-handle {
  z-index: 2;
}
</style>
