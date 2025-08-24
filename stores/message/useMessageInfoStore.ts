/**
 * [알림 메시지 스토어]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 */

import type { VModelType, RModelType } from '~/components/message/Info.vue';

export const useMessageInfoStore = defineStore('messageInfoStore', () => {
  const _vModel = ref<VModelType>({ isOpen: false });
  const _rModel = ref<RModelType>({ title: '', message: '', isPersistent: false, onClose: undefined });

  const rModel = computed(() => _rModel.value as Readonly<RModelType>);

  function open(aTitle: string, message: string, isPersistent: boolean, onClose?: () => void) {
    _rModel.value.title = aTitle;
    _rModel.value.message = message;
    _rModel.value.isPersistent = isPersistent;
    _rModel.value.onClose = onClose;

    _vModel.value.isOpen = true;
  }

  return { _vModel, rModel, open };
});
