/**
 * [컴포넌트 스토어]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-19 / 정우근 / - / 최초작성
 */

import { COMPONENT_DATA } from '~/datas/components';
import { arrayToRecord } from '~/utils/collectionUtils';
import type { ComponentMapKeyType, ComponentConfigsMapKeyType } from '~/components/widget/mapper';

export type { ComponentMapKeyType, ComponentConfigsMapKeyType };

/**
 * 컴포넌트 옵션 타입
 */
export type WidgetBasicConfigsType = { subtitle: string };
export type WidgetProjectConfigsType = { projCode: string; fontSize: number };
export type WidgetClockConfigsType = { type: string };

export type ComponentConfigsMapType = {
  WidgetProject: WidgetProjectConfigsType;
  WidgetClock: WidgetClockConfigsType;
  WidgetSamplePieChart: WidgetBasicConfigsType;
};

/**
 * 컴포넌트 타입
 *
 * @property componentId 컴포넌트 ID
 * @property src 대표 이미지 경로
 * @property name 이름
 * @property isConfigurable 설정가능여부
 */
export type ComponentType<K extends ComponentMapKeyType = ComponentMapKeyType> = {
  componentId: K;
  src: string;
  name: string;
  isConfigurable: boolean;
  configs?: K extends keyof ComponentConfigsMapType ? ComponentConfigsMapType[K] : never;
};

/**
 * 컴포넌트 목록 타입
 */
export type ComponentListType = Record<string, ComponentType>;

export const useComponentsStore = defineStore('componentsStore', () => {
  const _components: ComponentListType = {};
  const components: Readonly<ComponentListType> = _components;

  /**
   * 초기화
   */
  async function init() {
    const lDatas = arrayToRecord(COMPONENT_DATA, 'componentId');
    Object.assign(_components, lDatas);
  }

  return { components, init };
});
