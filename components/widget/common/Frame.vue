<!--
 - [위젯 프레임 레이아웃 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-07-22 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="pa-0 overflow-hidden" style="height: 100%">
    <WidgetCommonHeader style="height: 48px" />

    <v-sheet class="d-flex justify-center align-center overflow-auto" style="height: calc(100% - 48px)">
      <Suspense>
        <template #default>
          <component :is="componentObject" />
        </template>
        <template #fallback>
          <WidgetCommonLoading />
        </template>
      </Suspense>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { COMPONENT_MAP } from '~/components/widget/mapper';
import { WIDGET } from '~/keys/provider';

const widget = inject<ComputedRef<Readonly<WidgetType>>>(WIDGET);

const sComponentId = widget?.value.componentId;
const componentObject = sComponentId && COMPONENT_MAP[sComponentId] ? markRaw(COMPONENT_MAP[sComponentId]) : null;
</script>
