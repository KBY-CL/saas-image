<!--
 - [위젯 프로젝트 선택 옵션 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-14 / 정우근 / - / 최초작성
 -->

<template>
  <DialogConfirm v-model="vModelOfConfigDialog" :r-model="rModelOfConfigDialog">
    <v-form ref="form" v-model="formData.isFormValid" validate-on="input" lazy-validation @submit.prevent>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="formData.name" label="위젯명" hide-details="auto" :rules="[formValidator.required]"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-combobox v-model="formData.configs.projCode" label="현장" :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" hide-details="auto" :rules="[formValidator.required]"></v-combobox>
        </v-col>
        <v-col cols="12">
          <v-slider v-model="formData.configs.fontSize" :max="10" :min="1" :step="1" label="글자크기" thumb-color="white" thumb-label thumb-size="15" hide-details="auto"></v-slider>
        </v-col>
      </v-row>
    </v-form>
  </DialogConfirm>
</template>

<script setup lang="ts">
import { WIDGET } from '~/keys/provider';
import type { VModelType as VModelTypeOfConfigDialog, RModelType as RModelTypeOfConfigDialog } from '~/components/dialog/Confirm.vue';
import type { VForm } from 'vuetify/components';

export type VModelType = {
  isOpen: boolean;
};

const pageLogic = usePageLogic();
const formValidator = useFormValidator();

const vModel = defineModel<VModelType>({ default: { isOpen: false } });

const widget = inject<ComputedRef<Readonly<WidgetType<'WidgetProject'>>>>(WIDGET);

const form = ref<VForm | null>(null);
const formData = reactive({
  isFormValid: false,
  name: widget?.value.name ?? '',
  configs: structuredClone(toRaw(widget?.value.configs)) ?? { projCode: '', fontSize: 1 },
});

const vModelOfConfigDialog: VModelTypeOfConfigDialog = vModel.value;

const rModelOfConfigDialog: RModelTypeOfConfigDialog = {
  title: '위젯 설정',
  maxWidth: 500,
  onBeforeClose: callbackOnBeforeCloseOfConfigDialog,
  onClose: callbackOnCloseOfConfigDialog,
};

async function callbackOnBeforeCloseOfConfigDialog(abConfirmed: boolean) {
  if (!abConfirmed) return true;
  await form.value?.validate();
  return formData.isFormValid;
}

function callbackOnCloseOfConfigDialog(abConfirmed: boolean) {
  if (!abConfirmed) return;
  if (!widget?.value.widgetId) return;

  pageLogic.changeWidgetConfigs(widget?.value.widgetId, formData.name, structuredClone(toRaw(formData.configs)));
}
</script>
