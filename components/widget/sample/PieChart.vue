<!--
 - [위젯 파이 차트 컴포넌트 샘플]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="pa-0 fill-height align-start">
    <ChartPie :r-model="pieChartRModel" />
  </v-container>
</template>

<script setup lang="ts">
import type { PieChartDataType, PieChartOptionsType, PieChartRModelType } from '~/components/chart/Pie.vue';

const pieChartData: PieChartDataType = {
  labels: ['Desktop', 'Tablet', 'Mobile'],
  datasets: [
    {
      label: 'Users',
      data: [40, 35, 25],
      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(16, 185, 129, 0.6)', 'rgba(54, 162, 235, 0.8)'],
      borderColor: 'rgb(33, 33, 33)',
    },
  ],
};

const pieChartOptions: PieChartOptionsType = {
  plugins: {
    legend: {
      position: 'left',
    },
  },
};

const pieChartRModel: PieChartRModelType = {
  chartData: pieChartData,
  chartOptions: pieChartOptions,
};
</script>
