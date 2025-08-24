<!--
 - [위젯 프로젝트 선택 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-14 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid>
    <v-sheet class="d-flex flex-column justify-center align-center">
      <v-card link>
        <v-card-text class="pt-2 pb-1 px-5" :style="{ fontSize: widget?.configs?.fontSize + 'rem' }">{{ user?.projName }}</v-card-text>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { WIDGET } from '~/keys/provider';

const userLogic = useUserLogic();

const widget = inject<ComputedRef<Readonly<WidgetType<'WidgetProject'>>>>(WIDGET);

const user = userLogic.get();
</script>

<style scoped>
.v-card-text {
  font-family: 'Do Hyeon';
}
</style>
