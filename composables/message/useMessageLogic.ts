/**
 * <pre>
 * [메시지 로직]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 * </pre>
 */

export const useMessageLogic = () => {
  const messageInfoStore = useMessageInfoStore();
  const messageConfirmStore = useMessageConfirmStore();

  /**
   * 알림 다이얼로그 표시
   *
   * @param title 제목
   * @param message 내용
   * @param isPersistent ESC, 외부클릭시 닫힘 방지 여부 (기본값: false)
   * @param onClose 닫힐때 콜백 함수
   */
  const showInfoDialog = (title: string, message: string, isPersistent?: boolean, onClose?: () => void) => {
    messageInfoStore.open(title, message, isPersistent || false, onClose);
  };

  /**
   * 확인 다이얼로그 표시
   *
   * @param title 제목
   * @param message 내용
   * @param isPersistent ESC, 외부클릭시 닫힘 방지 여부 (기본값: false)
   * @param onClose 닫힐때 콜백 함수
   */
  const showConfirmDialog = (title: string, message: string, isPersistent?: boolean, onClose?: (abConfirmed: boolean) => void) => {
    messageConfirmStore.open(title, message, isPersistent || false, onClose);
  };

  return { showInfoDialog, showConfirmDialog };
};
