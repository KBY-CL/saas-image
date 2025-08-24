<!--
 - [확인 메시지 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-07-31 / 정우근 / - / 최초작성
 -->

<template>
  <v-dialog v-model="vModel.isOpen" max-width="500" :persistent="rModel.isPersistent">
    <v-card :title="rModel.title" prepend-icon="mdi-check-circle-outline">
      <v-card-text class="text-pre-line">{{ rModel.message }}</v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn text="닫기" @click="handleClose(false)"></v-btn>
        <v-btn text="확인" color="red" variant="elevated" @click="handleClose(true)"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
export type VModelType = {
  isOpen: boolean;
};

export type RModelType = {
  title: string;
  message: string;
  isPersistent: boolean;
  onClose?: (aIsConfirmed: boolean) => void;
};

const vModel = defineModel<VModelType>({ default: { isOpen: false } });

const props = defineProps<{
  rModel: RModelType;
}>();
const rModel = props.rModel;

function handleClose(aIsConfirmed: boolean) {
  vModel.value.isOpen = false;
  rModel.onClose?.(aIsConfirmed); // 콜백이 정의되어 있으면 실행
}
</script>
