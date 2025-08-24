<!--
 - [확인 다이얼로그 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-dialog v-model="vModel.isOpen" :max-width="rModel.maxWidth ?? 1200" class="pa-1" :persistent="rModel.isPersistent">
    <v-card>
      <v-sheet class="cll-title py-3 px-4 bg-grey-darken-4 position-sticky top-0">
        <v-card-title class="py-0">{{ rModel.title }}</v-card-title>
        <v-card-subtitle v-if="rModel.subtitle">{{ rModel.subtitle }}</v-card-subtitle>
      </v-sheet>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions class="d-flex justify-end position-sticky bottom-0 bg-grey-darken-4 py-3">
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
  subtitle?: string;
  maxWidth?: number;
  isPersistent?: boolean;
  onBeforeClose?: (aIsConfirmed: boolean) => boolean | Promise<boolean> | undefined;
  onClose?: (aIsConfirmed: boolean) => void;
};

const vModel = defineModel<VModelType>({ default: { isOpen: false, title: '' } });

const props = defineProps<{
  rModel: RModelType;
}>();
const rModel = props.rModel;

async function handleClose(aIsConfirmed: boolean) {
  const rtn = rModel.onBeforeClose?.(aIsConfirmed);

  let bChecked = true;
  if (typeof rtn === 'boolean') {
    bChecked = rtn;
  } else if (rtn instanceof Promise) {
    bChecked = await rtn;
  }

  if (bChecked === false) return;

  vModel.value.isOpen = false;
  rModel.onClose?.(aIsConfirmed);
}
</script>

<style scoped>
.cll-title {
  z-index: 10;
}
</style>
