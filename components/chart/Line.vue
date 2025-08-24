<!--
 - [라인 차트 컴포넌트]
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

export type LineChartDataType = ChartData<'line'>;
export type LineChartOptionsType = ChartOptions<'line'>;
export type LineChartTooltipItemType = TooltipItem<'line'>;

export type LineChartRModelType = {
  chartData: LineChartDataType;
  chartOptions?: LineChartOptionsType;
};

const props = defineProps<{
  rModel: LineChartRModelType;
}>();
const rModel = props.rModel;

const chartBaseRModel = computed<ChartBaseRModelType>(() => ({
  type: 'line',
  chartData: rModel.chartData,
  chartOptions: rModel.chartOptions,
}));
</script>
