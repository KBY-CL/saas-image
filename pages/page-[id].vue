<!--
 - [대시보드 페이지]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-07-23 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="pa-0">
    <div class="grid-stack ma-2 ml-1 mr-1"></div>
  </v-container>
</template>

<script setup lang="ts">
import { render } from 'vue';
import { GridStack } from 'gridstack';
import ProviderWrapper from '~/components/widget/common/ProviderWrapper';
import type { AppContext } from 'vue';

const pageLogic = usePageLogic();

const inst = getCurrentInstance() as { appContext: AppContext };
const { appContext } = inst;

onMounted(async () => {
  await nextTick();

  GridStack.renderCB = function (el, w) {
    if (!w.id) return;

    const vnode = h(ProviderWrapper, { widgetId: w.id });
    vnode.appContext = appContext;

    render(vnode, el);
  };

  const gridStack = GridStack.init(
    {
      margin: 5,
      column: 12,
      cellHeight: '150px',
      draggable: {
        handle: '.cll-handle',
      },
    },
    '.grid-stack'
  );

  pageLogic.setGridStack(gridStack);
  pageLogic.reloadWidgets();
});
</script>

<style scoped>
.grid-stack-item-content {
  display: flex;
  justify-content: center;
  align-items: start;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
