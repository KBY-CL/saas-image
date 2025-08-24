/**
 * <pre>
 * [위젯 셀렉터 로직]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 * </pre>
 */

export const useWidgetSelectorLogic = () => {
  const selectorDialogStore = useSelectorDialogStore();

  /**
   * 다이얼로그 표시
   *
   * @param selectedComponent 선택된 컴포넌트
   * @param onClose 닫힐때 콜백 함수
   */
  const show = (selectedComponent?: ComponentMapKeyType, onClose?: (abConfirmed: boolean, aSelectedComponent: ComponentMapKeyType, aName: string, aisConfigurable: boolean) => void) => {
    selectorDialogStore.open(selectedComponent, onClose);
  };

  return { show };
};
