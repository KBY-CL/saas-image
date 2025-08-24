<!--
 - [바 차트 컴포넌트]
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

export type BarChartDataType = ChartData<'bar'>;
export type BarChartOptionsType = ChartOptions<'bar'>;
export type BarChartTooltipItemType = TooltipItem<'bar'>;

export type BarChartRModelType = {
  chartData: BarChartDataType;
  chartOptions?: BarChartOptionsType;
};

const props = defineProps<{
  rModel: BarChartRModelType;
}>();
const rModel = props.rModel;

const chartBaseRModel = computed<ChartBaseRModelType>(() => ({
  type: 'bar',
  chartData: rModel.chartData,
  chartOptions: rModel.chartOptions,
}));
</script>
