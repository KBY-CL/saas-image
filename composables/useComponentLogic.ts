/**
 * <pre>
 * [컴포넌트 로직]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-01 / 정우근 / - / 최초작성
 * </pre>
 */

export const useComponentLogic = () => {
  const componentsStore = useComponentsStore();

  /**
   * 컴포넌트 목록 가져오기
   */
  const getComponents = () => {
    return componentsStore.components;
  };

  /**
   * 컴포넌트 가져오기
   *
   * @param aComponentId 컴포넌트 ID
   * @returns 컴포넌트
   */
  const getComponent = (aComponentId: ComponentMapKeyType) => {
    return componentsStore.components[aComponentId];
  };

  return { getComponents, getComponent };
};
