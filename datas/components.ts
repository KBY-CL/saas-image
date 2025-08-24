import type { ComponentType } from '~/stores/useComponentsStore';

export const COMPONENT_DATA = [
  { componentId: 'WidgetProject', name: 'Project', src: 'https://cdn.vuetifyjs.com/images/backgrounds/md.jpg', isConfigurable: true, configs: { projCode: '', fontSize: 1 } },
  { componentId: 'WidgetClock', name: 'Clock', src: 'https://cdn.vuetifyjs.com/images/backgrounds/md.jpg', isConfigurable: true, configs: { type: '' } },
  { componentId: 'WidgetArrAndNcr', name: '추가위험발굴/부적합보고서', src: 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg', isConfigurable: false },
  { componentId: 'WidgetSampleTimeline', name: 'Timeline', src: 'https://cdn.vuetifyjs.com/images/backgrounds/bg.jpg', isConfigurable: false },
  { componentId: 'WidgetSampleTable', name: 'Table', src: 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg', isConfigurable: false },
  { componentId: 'WidgetSampleList', name: 'LIst', src: 'https://cdn.vuetifyjs.com/images/backgrounds/md2.jpg', isConfigurable: false },
  { componentId: 'WidgetSampleImage', name: 'Image', src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg', isConfigurable: false },
  { componentId: 'WidgetSampleBarChart', name: 'BarChart', src: 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg', isConfigurable: false },
  { componentId: 'WidgetSampleLineChart', name: 'LineChart', src: 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg', isConfigurable: false },
  { componentId: 'WidgetSamplePieChart', name: 'PieChart', src: 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg', isConfigurable: true, configs: { subtitle: '' } },
] satisfies ComponentType[];
