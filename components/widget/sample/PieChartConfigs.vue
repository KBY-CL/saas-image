<!--
 - [위젯 파이 차트 옵션 컴포넌트 샘플]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-11 / 정우근 / - / 최초작성
 -->

<template>
  <DialogConfirm v-model="vModelOfConfigDialog" :r-model="rModelOfConfigDialog">
    <v-form v-model="isFormValidOfConfigDialog" validate-on="input" lazy-validation @submit.prevent>
      <v-text-field v-model="wigetNameOfConfigDialog" label="이름" hide-details="auto" :rules="[formValidator.required]"></v-text-field>
    </v-form>
  </DialogConfirm>
</template>

<script setup lang="ts">
import type { VModelType as VModelTypeOfConfigDialog, RModelType as RModelTypeOfConfigDialog } from '~/components/dialog/Confirm.vue';

export type RModelType = {
  widgetId: string;
};

const pageLogic = usePageLogic();
const formValidator = useFormValidator();

const props = defineProps<{
  rModel: RModelType;
}>();
const rModel = props.rModel;

const widget = pageLogic.getWidget(rModel.widgetId);

const vModelOfConfigDialog = ref<VModelTypeOfConfigDialog>({
  isOpen: false,
});

const rModelOfConfigDialog: RModelTypeOfConfigDialog = {
  title: '위젯 설정',
  maxWidth: 500,
  onBeforeClose: callbackOnBeforeCloseOfConfigDialog,
  onClose: callbackOnCloseOfConfigDialog,
};

const isFormValidOfConfigDialog = ref(false);
const wigetNameOfConfigDialog = ref(widget?.name);

function callbackOnBeforeCloseOfConfigDialog(abConfirmed: boolean) {
  if (abConfirmed) return isFormValidOfConfigDialog.value;
}

function callbackOnCloseOfConfigDialog(abConfirmed: boolean) {
  if (abConfirmed) {
    pageLogic.changeWidgetConfigs(rModel.widgetId, wigetNameOfConfigDialog.value || '');
  }
}
</script>
