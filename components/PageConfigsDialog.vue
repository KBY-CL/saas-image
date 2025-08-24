<!--
 - [페이지 옵션 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-12 / 정우근 / - / 최초작성
 -->

<template>
  <DialogConfirm v-model="vModelOfConfigDialog" :r-model="rModelOfConfigDialog">
    <v-form v-model="formData.isFormValid" validate-on="input" lazy-validation @submit.prevent>
      <v-text-field v-model="formData.name" label="이름" hide-details="auto" :rules="[formValidator.required]"></v-text-field>
    </v-form>
  </DialogConfirm>
</template>

<script setup lang="ts">
import type { VModelType as VModelTypeOfConfigDialog, RModelType as RModelTypeOfConfigDialog } from '~/components/dialog/Confirm.vue';

export type OnCloseResponseType = {
  isConfirmed: boolean;
  pageId?: string;
  name: string;
};

export type VModelType = {
  isOpen: boolean;
};

export type RModelType = {
  pageId?: string;
  name: string;
  onClose?: (args: OnCloseResponseType) => void;
};

const formValidator = useFormValidator();

const vModel = defineModel<VModelType>({ default: { isOpen: false } });

const props = defineProps<{
  rModel: RModelType;
}>();
const { rModel } = toRefs(props);

const vModelOfConfigDialog: VModelTypeOfConfigDialog = vModel.value;

const rModelOfConfigDialog: RModelTypeOfConfigDialog = {
  title: '페이지 설정',
  maxWidth: 500,
  onBeforeClose: callbackOnBeforeCloseOfConfigDialog,
  onClose: callbackOnCloseOfConfigDialog,
};

const formData = ref({
  isFormValid: false,
  name: '',
});

watch(
  () => [vModel.value.isOpen],
  () => {
    if (vModel.value.isOpen) {
      formData.value.isFormValid = false;
      formData.value.name = rModel.value.name;
    }
  }
);

function callbackOnBeforeCloseOfConfigDialog(abConfirmed: boolean) {
  if (abConfirmed) return formData.value.isFormValid;
}

function callbackOnCloseOfConfigDialog(abConfirmed: boolean) {
  const res = {
    isConfirmed: abConfirmed,
    pageId: rModel.value.pageId,
    name: formData.value.name,
  };

  rModel.value.onClose?.(res);
}
</script>
