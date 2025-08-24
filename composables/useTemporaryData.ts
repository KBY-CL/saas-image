/**
 * <pre>
 * [임시 데이터]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 * </pre>
 */

import type { WidgetType, PageType } from '~/stores/usePagesStore';

export const useTemporaryData = () => {
  const _rWidgetDatas = [
    {
      id: 'widget1',
      name: 'Clock',
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      widgetId: 'widget1',
      componentId: 'WidgetClock',
      isConfigurable: true,
      configs: {
        type: 'Clock Type',
      },
    },
    {
      id: 'widget2',
      name: 'Image',
      x: 2,
      y: 0,
      w: 3,
      h: 2,
      widgetId: 'widget2',
      componentId: 'WidgetSampleImage',
      isConfigurable: false,
    },
    {
      id: 'widget5',
      name: 'List',
      x: 5,
      y: 0,
      w: 3,
      h: 4,
      widgetId: 'widget5',
      componentId: 'WidgetSampleList',
      isConfigurable: false,
    },
    {
      id: 'widget7',
      name: '추가위험발굴/부적합보고서',
      x: 8,
      y: 0,
      w: 4,
      h: 7,
      widgetId: 'widget7',
      componentId: 'WidgetArrAndNcr',
      isConfigurable: false,
    },
    {
      id: 'widget8',
      name: 'BarChart',
      x: 0,
      y: 2,
      w: 3,
      h: 3,
      widgetId: 'widget8',
      componentId: 'WidgetSampleBarChart',
      isConfigurable: false,
    },
    {
      id: 'widget6',
      name: 'Timeline',
      x: 3,
      y: 2,
      w: 2,
      h: 2,
      widgetId: 'widget6',
      componentId: 'WidgetSampleTimeline',
      isConfigurable: false,
    },
    {
      id: 'widget4',
      name: 'Table',
      x: 3,
      y: 4,
      w: 3,
      h: 3,
      widgetId: 'widget4',
      componentId: 'WidgetSampleTable',
      isConfigurable: false,
    },
    {
      id: 'widget10',
      name: 'PieChart',
      x: 6,
      y: 4,
      w: 2,
      h: 3,
      widgetId: 'widget10',
      componentId: 'WidgetSamplePieChart',
      isConfigurable: true,
      configs: {
        subtitle: 'PieChart Subtitle',
      },
    },
    {
      id: 'widget9',
      name: 'LineChart',
      x: 0,
      y: 5,
      w: 3,
      h: 3,
      widgetId: 'widget9',
      componentId: 'WidgetSampleLineChart',
      isConfigurable: false,
    },
    {
      id: 'widget11',
      name: 'Project',
      x: 3,
      y: 7,
      w: 3,
      h: 1,
      widgetId: 'widget11',
      componentId: 'WidgetProject',
      isConfigurable: true,
      configs: {
        projCode: 'R001',
        fontSize: 1,
      },
    },
  ] satisfies WidgetType[];

  const rPageDatas = [
    { pageId: 'page1', name: 'Page 1', path: '/page-1', isActive: true, widgets: _rWidgetDatas },
    { pageId: 'page2', name: 'Page 2', path: '/page-2', isActive: false, widgets: _rWidgetDatas },
    { pageId: 'page3', name: 'Page 3', path: '/page-3', isActive: false, widgets: _rWidgetDatas },
  ] satisfies PageType[];

  return { rPageDatas };
};
