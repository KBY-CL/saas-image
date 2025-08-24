<!--
 - [위젯 리스트 컴포넌트 샘플]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="fill-height w-100 pa-0">
    <v-sheet class="w-100 d-flex flex-column ga-2 pa-3">
      <v-card v-for="item in items" :key="item.id" class="w-100" :title="item.title" :subtitle="item.subtitle" link @click="openDialog(item.title, item.subtitle, item.id)"></v-card>
    </v-sheet>

    <DialogInfo v-model="dialogInfoVModel" :r-model="dialogInfoRModel">
      <p v-for="n in 100" :key="n">이곳에 추가 설명 또는 컴포넌트를 넣을 수 있습니다. {{ n }}</p>
    </DialogInfo>
  </v-container>
</template>

<script setup lang="ts">
import type { VModelType as DialogInfoVModelType, RModelType as DialogInfoRModelType } from '~/components/dialog/Info.vue';

const dialogInfoVModel = ref<DialogInfoVModelType>({ isOpen: false });
const dialogInfoRModel = ref<DialogInfoRModelType>({ title: '' });

const items = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Same looks, no anchor ${i + 1}`,
  subtitle: `Hover and click me ${i + 1}`,
}));

function openDialog(aTitle: string, aSubtitle: string, aId: number) {
  dialogInfoVModel.value.isOpen = true;

  dialogInfoRModel.value.title = aTitle;
  dialogInfoRModel.value.subtitle = aId % 2 === 0 ? aSubtitle : undefined;
}
</script>
