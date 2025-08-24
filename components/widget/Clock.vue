<!--
 - [위젯 시계 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid>
    <v-sheet class="d-flex justify-center align-center">
      <div ref="clsClock"></div>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
const clsClock = ref<Element | null>(null);

onMounted(async () => {
  useClock().attach(clsClock.value);
});
</script>
