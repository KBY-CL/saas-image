<!--
 - [파이 차트 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <ChartBase :r-model="chartBaseRModel" />
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions, TooltipItem, RModelType as ChartBaseRModelType } from '~/components/chart/Base.vue';

export type PieChartDataType = ChartData<'pie'>;
export type PieChartOptionsType = ChartOptions<'pie'>;
export type PieChartTooltipItemType = TooltipItem<'pie'>;

export type PieChartRModelType = {
  chartData: PieChartDataType;
  chartOptions?: PieChartOptionsType;
};

const props = defineProps<{
  rModel: PieChartRModelType;
}>();
const rModel = props.rModel;

const chartBaseRModel = computed<ChartBaseRModelType>(() => ({
  type: 'pie',
  chartData: rModel.chartData,
  chartOptions: rModel.chartOptions,
}));
</script>
