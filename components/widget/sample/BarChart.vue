<!--
 - [위젯 바 차트 컴포넌트 샘플]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="pa-0 fill-height align-start">
    <ChartBar :r-model="barChartRModel" />
  </v-container>
</template>

<script setup lang="ts">
import type { BarChartDataType, BarChartOptionsType, BarChartRModelType } from '~/components/chart/Bar.vue';

const barChartData: BarChartDataType = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Value1',
      data: [12, 19, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
    },
    {
      label: 'Value2',
      data: [1, 5, 10],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    },
  ],
};

const barChartOptions: BarChartOptionsType = {
  plugins: {
    title: {
      display: true,
      text: '차트 타이틀',
    },
    subtitle: {
      display: true,
      text: '차트 서브타이틀',
    },
    legend: {
      position: 'right',
    },
  },
};

const barChartRModel: BarChartRModelType = {
  chartData: barChartData,
  chartOptions: barChartOptions,
};
</script>
