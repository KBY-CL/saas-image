/**
 * [위젯 셀렉터 스토어]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 */

import type { VModelType, RModelType } from '~/components/widget/common/SelectorDialog.vue';

export const useSelectorDialogStore = defineStore('selectorDialogStore', () => {
  const _vModel = ref<VModelType>({ isOpen: false, selectedComponentId: undefined });
  const _rModel = ref<RModelType>({ onClose: undefined });

  const rModel = computed(() => _rModel.value as Readonly<RModelType>);

  function open(aSelectedComponentId?: ComponentMapKeyType, onClose?: (abConfirmed: boolean, aSelectedComponentId: ComponentMapKeyType, aName: string, aisConfigurable: boolean) => void) {
    _vModel.value.isOpen = true;
    _vModel.value.selectedComponentId = aSelectedComponentId;

    _rModel.value.onClose = onClose;
  }

  return { _vModel, rModel, open };
});
