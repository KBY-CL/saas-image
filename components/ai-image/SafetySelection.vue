<!--
 * 안전대책 최종 선택 컴포넌트
 * 사용자가 최종적으로 선택한 유해위험요인과 안전대책을 확인하고 제출
 -->
<template>
  <div class="safety-selection">
    <!-- 최종 선택 확인 헤더 -->
    <div class="text-center mb-6">
      <v-icon size="64" color="info" class="mb-4">
        mdi-clipboard-check
      </v-icon>
      <h3 class="text-h5 mb-2 text-info">최종 선택 확인</h3>
      <p class="text-body-1 text-medium-emphasis">
        선택하신 유해위험요인과 안전대책을 최종 확인하고 제출하세요.
      </p>
    </div>

    <!-- 선택된 항목들 요약 -->
    <v-card class="mb-6 pa-6" variant="outlined">
      <div class="d-flex justify-space-between align-center mb-4">
        <h4 class="text-h6 d-flex align-center mb-0">
          <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
          선택된 안전대책 요약
        </h4>
        
        <!-- 전체선택/해제 버튼 -->
        <div class="d-flex">
          <v-btn
            color="success"
            variant="outlined"
            size="small"
            class="mr-2"
            @click="selectAllMeasures"
          >
            <v-icon left size="small">mdi-check-all</v-icon>
            전체선택
          </v-btn>
          <v-btn
            color="error"
            variant="outlined"
            size="small"
            @click="deselectAllMeasures"
          >
            <v-icon left size="small">mdi-close-box-multiple</v-icon>
            전체해제
          </v-btn>
        </div>
      </div>

      <div v-if="selectedItems.length > 0" class="selected-items-summary">
        <div 
          v-for="(item, index) in selectedItems" 
          :key="index"
          class="selected-item mb-4"
        >
          <div class="item-header d-flex align-center mb-2">
            <v-chip color="warning" variant="outlined" class="mr-3">
              {{ index + 1 }}
            </v-chip>
            <span class="text-h6 font-weight-medium">{{ item.hazardName }}</span>
          </div>
          
          <div class="item-content">
            <div class="hazard-description mb-3">
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ item.hazardDescription }}
              </p>
            </div>
            
            <div class="selected-measures">
              <h6 class="text-subtitle-2 mb-2 text-success">
                선택된 안전대책:
              </h6>
              <div class="measures-list">
                <v-chip
                  v-for="measure in item.measures"
                  :key="measure.id"
                  color="success"
                  variant="outlined"
                  class="mr-2 mb-2"
                >
                  <v-icon left size="small">mdi-shield-check</v-icon>
                  {{ measure.name }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center text-medium-emphasis py-8">
        <v-icon color="grey" size="64" class="mb-4">mdi-information</v-icon>
        <p class="mb-0">선택된 항목이 없습니다.</p>
      </div>
    </v-card>

    <!-- 최종 선택 통계 -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" variant="outlined">
          <v-icon size="48" color="warning" class="mb-2">mdi-alert-triangle</v-icon>
          <div class="text-h4 font-weight-bold text-warning">
            {{ selectedHazardsCount }}
          </div>
          <div class="text-body-2 text-medium-emphasis">선택된 위험요인</div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" variant="outlined">
          <v-icon size="48" color="success" class="mb-2">mdi-shield-check</v-icon>
          <div class="text-h4 font-weight-bold text-success">
            {{ totalSelectedMeasures }}
          </div>
          <div class="text-body-2 text-medium-emphasis">선택된 안전대책</div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="4">
        <v-card class="pa-4 text-center" variant="outlined">
          <v-icon size="48" color="info" class="mb-2">mdi-percent</v-icon>
          <div class="text-h4 font-weight-bold text-info">
            {{ coveragePercentage }}%
          </div>
          <div class="text-body-2 text-medium-emphasis">위험요인 커버리지</div>
        </v-card>
      </v-col>
    </v-row>



    <!-- 최종 제출 버튼 -->
    <div class="text-center">
      <v-btn
        color="success"
        size="x-large"
        :disabled="!canSubmit"
        @click="submitSelection"
        class="px-8"
      >
        <v-icon left>mdi-send</v-icon>
        최종 제출
      </v-btn>
      
      <div v-if="!canSubmit" class="text-caption text-medium-emphasis mt-2">
        안전대책을 선택해주세요.
      </div>
    </div>

    <!-- 제출 확인 다이얼로그 -->
    <v-dialog v-model="showConfirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          최종 제출 확인
        </v-card-title>
        
        <v-card-text>
          <p>선택하신 안전대책을 최종 제출하시겠습니까?</p>
          <p class="text-caption text-medium-emphasis">
            제출 후에는 수정이 불가능합니다.
          </p>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="showConfirmDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            color="success"
            @click="confirmSubmit"
          >
            제출
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props & Emits
interface SafetyMeasure {
  id: number
  name: string
  description: string
}

interface Hazard {
  id: number
  name: string
  description: string
  safetyMeasures: SafetyMeasure[]
}

interface AnalysisData {
  imageDescription: string
  hazards: Hazard[]
}

interface Props {
  analysisData: AnalysisData
  selectedData: any
}

const emit = defineEmits<{
  'selection-complete': [data: any]
}>()

const props = defineProps<Props>()

// 상태 관리
const showConfirmDialog = ref(false)

// 선택된 항목들 계산
const selectedItems = computed(() => {
  if (!props.selectedData || !props.selectedData.selectedMeasures) {
    return []
  }
  
  return props.analysisData.hazards.map(hazard => {
    const selectedMeasureIds = props.selectedData.selectedMeasures.get(hazard.id) || new Set()
    const selectedMeasures = hazard.safetyMeasures.filter(measure => 
      selectedMeasureIds.has(measure.id)
    )
    
    return {
      hazardName: hazard.name,
      hazardDescription: hazard.description,
      measures: selectedMeasures
    }
  }).filter(item => item.measures.length > 0)
})

// 선택된 위험요인 개수
const selectedHazardsCount = computed(() => selectedItems.value.length)

// 선택된 안전대책 총 개수
const totalSelectedMeasures = computed(() => {
  return selectedItems.value.reduce((total, item) => total + item.measures.length, 0)
})

// 커버리지 퍼센트
const coveragePercentage = computed(() => {
  if (props.analysisData.hazards.length === 0) return 0
  return Math.round((selectedHazardsCount.value / props.analysisData.hazards.length) * 100)
})

// 제출 가능 여부
const canSubmit = computed(() => {
  return selectedItems.value.length > 0
})

// 제출 처리
const submitSelection = () => {
  showConfirmDialog.value = true
}

// 전체 안전대책 선택
const selectAllMeasures = () => {
  if (props.selectedData && props.selectedData.selectedMeasures) {
    props.analysisData.hazards.forEach(hazard => {
      if (!props.selectedData.selectedMeasures.has(hazard.id)) {
        props.selectedData.selectedMeasures.set(hazard.id, new Set())
      }
      const hazardMeasures = props.selectedData.selectedMeasures.get(hazard.id)!
      hazard.safetyMeasures.forEach(measure => {
        hazardMeasures.add(measure.id)
      })
    })
  }
}

// 전체 안전대책 해제
const deselectAllMeasures = () => {
  if (props.selectedData && props.selectedData.selectedMeasures) {
    props.selectedData.selectedMeasures.clear()
  }
}

// 최종 제출 확인
const confirmSubmit = () => {
  showConfirmDialog.value = false
  
  const submissionData = {
    selectedItems: selectedItems.value,
    statistics: {
      hazardsCount: selectedHazardsCount.value,
      measuresCount: totalSelectedMeasures.value,
      coverage: coveragePercentage.value
    },
    timestamp: new Date().toISOString()
  }
  
  emit('selection-complete', submissionData)
}
</script>

<style scoped>
.safety-selection {
  width: 100%;
}

.selected-item {
  padding: 16px;
  background: var(--v-surface-variant);
  border-radius: 12px;
  border-left: 4px solid var(--v-warning-base);
}

.item-header {
  border-bottom: 1px solid var(--v-border-color);
  padding-bottom: 8px;
}

.measures-list {
  display: flex;
  flex-wrap: wrap;
}

.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}
</style>