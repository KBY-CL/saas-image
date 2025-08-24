<!--
 - [위젯 셀렉터 다이얼로그 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <DialogConfirm v-model="dialogConfirmVModel" :r-model="dialogConfirmRModel">
    <v-item-group v-model="vModel.selectedComponentId">
      <v-row>
        <v-col v-for="(item, i) in tComponents" :key="i" cols="12" md="4">
          <v-item v-slot="{ isSelected, toggle }" :value="item.componentId">
            <v-img :src="item.src" class="text-right pa-2 position-relative" height="300" cover @click="toggle">
              <v-btn :icon="isSelected ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline'" variant="text" :class="['cll-checkbox', { 'cll-checked': isSelected }]" />
              <v-sheet class="position-absolute top-0 left-0 w-100 h-100 d-flex align-center justify-center text-white text-h6" elevation="0" color="transparent">
                {{ item.name }}
              </v-sheet>
            </v-img>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
  </DialogConfirm>
</template>

<script setup lang="ts">
import type { VModelType as DialogConfirmVModelType, RModelType as DialogConfirmRModelType } from '~/components/dialog/Confirm.vue';

export type VModelType = {
  isOpen: boolean;
  selectedComponentId?: ComponentMapKeyType;
};

export type RModelType = {
  onClose?: (abConfirmed: boolean, selectedComponentId: ComponentMapKeyType, aName: string, aisConfigurable: boolean) => void;
};

const vModel = defineModel<VModelType>({ default: { isOpen: false } });

const props = defineProps<{
  rModel: RModelType;
}>();
const rModel = props.rModel;

const componentLogic = useComponentLogic();

const tComponents = componentLogic.getComponents();

const dialogConfirmVModel: DialogConfirmVModelType = vModel.value;
const dialogConfirmRModel: DialogConfirmRModelType = {
  title: '위젯 선택',
  onClose: handleClose,
};

function handleClose(abConfirmed: boolean) {
  vModel.value.isOpen = false;

  let sComponentId: ComponentMapKeyType = 'WidgetCommonBlank',
    sName = 'Blank',
    bisConfigurable = false;

  if (abConfirmed) {
    if (vModel.value.selectedComponentId) {
      const wc = componentLogic.getComponent(vModel.value.selectedComponentId);
      if (wc) {
        sComponentId = wc.componentId;
        sName = wc.name;
        bisConfigurable = wc.isConfigurable;
      }
    }
  }

  rModel.onClose?.(abConfirmed, sComponentId, sName, bisConfigurable); // 콜백이 정의되어 있으면 실행
}
</script>

<style scoped>
.cll-title {
  z-index: 10;
}

.cll-checkbox.cll-checked {
  color: white !important;
}
</style>
