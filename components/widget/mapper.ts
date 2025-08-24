/**
 * [컴포넌트 매퍼]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-11 / 정우근 / - / 최초작성
 */

import WidgetCommonLoading from '~/components/widget/common/Loading.vue';
import WidgetCommonBlank from '~/components/widget/common/Blank.vue';
import WidgetSampleTimeline from '~/components/widget/sample/Timeline.vue';
import WidgetClock from '~/components/widget/Clock.vue';
import WidgetProject from '~/components/widget/Project.vue';
import WidgetSampleImage from '~/components/widget/sample/Image.vue';
import WidgetSampleList from '~/components/widget/sample/List.vue';
import BasicConfigsDialog from '~/components/widget/common/BasicConfigsDialog.vue';
import ProjectConfigsDialog from '~/components/widget/ProjectConfigsDialog.vue';
import ClockConfigsDialog from '~/components/widget/ClockConfigsDialog.vue';

/**
 * 컴포넌트 맵
 */
const COMPONENT_DEFS = {
  WidgetCommonLoading,
  WidgetCommonBlank,
  WidgetSampleTimeline,
  WidgetClock,
  WidgetProject,
  WidgetSampleImage,
  WidgetSampleList,
  WidgetSampleTable: defineAsyncComponent(() => import('~/components/widget/sample/Table.vue')),
  WidgetArrAndNcr: defineAsyncComponent(() => import('~/components/widget/ArrAndNcr.vue')),
  WidgetSampleBarChart: defineAsyncComponent(() => import('~/components/widget/sample/BarChart.vue')),
  WidgetSampleLineChart: defineAsyncComponent(() => import('~/components/widget/sample/LineChart.vue')),
  WidgetSamplePieChart: defineAsyncComponent(() => import('~/components/widget/sample/PieChart.vue')),
} as const;
export const COMPONENT_MAP: Record<keyof typeof COMPONENT_DEFS, Component> = markRaw(COMPONENT_DEFS) as { readonly [K in keyof typeof COMPONENT_DEFS]: Component };

/**
 * 컴포넌트 맵 키 타입
 */
export type ComponentMapKeyType = keyof typeof COMPONENT_DEFS;

/**
 * 옵션 컴포넌트 맵
 */
const COMPONENT_CONFIGS_DEFS = {
  Basic: BasicConfigsDialog,
  WidgetProject: ProjectConfigsDialog,
  WidgetClock: ClockConfigsDialog,
  WidgetSamplePieChart: BasicConfigsDialog,
} as const;
export const COMPONENT_CONFIGS_MAP: Record<keyof typeof COMPONENT_CONFIGS_DEFS, Component> = markRaw(COMPONENT_CONFIGS_DEFS) as { readonly [K in keyof typeof COMPONENT_CONFIGS_DEFS]: Component };

/**
 * 옵션 컴포넌트 맵 키 타입
 */
export type ComponentConfigsMapKeyType = keyof typeof COMPONENT_CONFIGS_DEFS;
