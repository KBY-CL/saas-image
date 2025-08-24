/**
 * <pre>
 * [스낵바 로직]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 * </pre>
 */

export const useSnackbarLogic = () => {
  const snackbarStore = useSnackbarStore();

  /**
   * 알림 표시
   *
   * @param aMessage 메시지
   */
  const showInfo = (aMessage: string, aTimeout: number = 5000) => {
    snackbarStore.show(aMessage, 'info', aTimeout);
  };

  /**
   * 성공 표시
   *
   * @param aMessage 메시지
   */
  const showSuccess = (aMessage: string, aTimeout: number = 1500) => {
    snackbarStore.show(aMessage, 'success', aTimeout);
  };

  /**
   * 경고 표시
   *
   * @param aMessage 메시지
   */
  const showWarning = (aMessage: string, aTimeout: number = 2000) => {
    snackbarStore.show(aMessage, 'warning', aTimeout);
  };

  /**
   * 에러 표시
   *
   * @param aMessage 메시지
   */
  const showError = (aMessage: string, aTimeout: number = 2000) => {
    snackbarStore.show(aMessage, 'error', aTimeout);
  };

  return { showInfo, showSuccess, showWarning, showError };
};
