<!--
 - [차트 기초 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-card class="pa-2 w-100 h-100 d-flex justify-center align-center">
    <canvas ref="canvasRef" />
  </v-card>
</template>

<script setup lang="ts">
import { Chart, registerables, type ChartData, type ChartOptions, type ChartType, type TooltipItem } from 'chart.js';
import merge from 'lodash/merge';

export type { ChartData, ChartOptions, TooltipItem };

export type RModelType = {
  type: ChartType;
  chartData: ChartData;
  chartOptions?: ChartOptions;
};

Chart.register(...registerables);

const props = defineProps<{
  rModel: RModelType;
}>();
const rModel = props.rModel;

const option = ref<ChartOptions | undefined>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const renderChart = () => {
  if (!canvasRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(canvasRef.value, {
    type: rModel.type,
    data: rModel.chartData,
    options: option.value,
  });
};

onMounted(() => {
  mergeOption();
  renderChart();
});

onBeforeUnmount(() => {
  chartInstance?.destroy();
});

watch(() => rModel.chartData, renderChart, { deep: true });
watch(() => rModel.chartOptions, mergeOption, { deep: true });
watch(() => option, renderChart);

const defaultOption: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { display: false },
    y: { display: false },
  },
  plugins: {
    title: {
      display: false,
      text: '',
      color: 'white',
    },
    subtitle: {
      display: false,
      text: '',
      color: 'white',
      padding: { bottom: 0 },
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: 'white',
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<ChartType>) => `${ctx.label}: ${ctx.formattedValue}`,
      },
    },
  },
};

function mergeOption() {
  option.value = merge({}, defaultOption, rModel.chartOptions);
}
</script>
