<!--
 - [위젯 라인 차트 컴포넌트 샘플]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="pa-0 fill-height align-start">
    <ChartLine :r-model="lineChartRModel" />
  </v-container>
</template>

<script setup lang="ts">
import type { LineChartDataType, LineChartOptionsType, LineChartRModelType } from '~/components/chart/Line.vue';

const lineChartData: LineChartDataType = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Revenue',
      data: [150, 250, 500, 240, 400],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Revenue',
      data: [250, 150, 300, 340, 300],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const lineChartOptions: LineChartOptionsType = {
  plugins: {
    title: {
      display: true,
      text: '차트 타이틀 123',
    },
    subtitle: {
      display: true,
      text: '차트 서브타이틀 123',
      padding: { bottom: 20 },
    },
  },
};

const lineChartRModel: LineChartRModelType = {
  chartData: lineChartData,
  chartOptions: lineChartOptions,
};
</script>
