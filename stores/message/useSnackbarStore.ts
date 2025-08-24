/**
 * [스낵바 스토어]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 */

export type SnackbarType = {
  text: string;
  variant: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain';
  contentClass: string;
  timeout: number;
};

export const useSnackbarStore = defineStore('snackbarStore', () => {
  const _messages = ref<SnackbarType[]>([]);

  function show(aMessage: string, aType: 'info' | 'success' | 'warning' | 'error', aTimeout: number) {
    _messages.value.push({
      text: aMessage,
      variant: 'elevated',
      contentClass: 'cl-snackbar-' + aType,
      timeout: aTimeout,
    });
  }

  return { _messages, show };
});
