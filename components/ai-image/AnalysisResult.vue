<!--
 * AI 분석 결과 표시 컴포넌트
 * 이미지 분석 결과로 도출된 유해위험요인과 안전대책을 표시
 -->
<template>
  <div class="analysis-result">
    <!-- 분석 완료 헤더 -->
    <div class="text-center mb-6">
      <v-icon size="64" color="success" class="mb-4">
        mdi-check-circle
      </v-icon>
      <h3 class="text-h5 mb-2 text-success">AI 분석 완료!</h3>
      <p class="text-body-1 text-medium-emphasis">
        이미지 분석이 완료되었습니다. 아래 결과를 확인하세요.
      </p>
    </div>

    <!-- 분석된 이미지 표시 -->
    <v-card class="mb-6 pa-4" variant="outlined">
      <div class="text-center">
        <h4 class="text-h6 mb-3 d-flex align-center justify-center">
          <v-icon color="info" class="mr-2">mdi-image</v-icon>
          분석된 이미지
        </h4>
        <div class="analyzed-image-container">
          <v-img
            :src="imagePreview"
            alt="분석된 이미지"
            max-width="400"
            max-height="300"
            class="mx-auto rounded-lg"
            cover
          />
        </div>
        <p class="text-caption text-medium-emphasis mt-2">
          이 이미지를 기반으로 AI가 안전 위험요인을 분석했습니다.
        </p>
      </div>
    </v-card>

    <!-- 이미지 설명 -->
    <v-card class="mb-6 pa-4" variant="outlined">
      <div class="d-flex align-start">
        <v-icon color="info" class="mr-3 mt-1">mdi-information</v-icon>
        <div>
          <h4 class="text-h6 mb-2">이미지 분석 요약</h4>
          <p class="text-body-1 mb-0">{{ analysisData.imageDescription }}</p>
        </div>
      </div>
    </v-card>

    <!-- 유해위험요인 목록 -->
    <div class="hazards-section mb-6">
      <div class="d-flex justify-space-between align-center mb-4">
        <h4 class="text-h6 d-flex align-center mb-0">
          <v-icon color="warning" class="mr-2">mdi-alert-triangle</v-icon>
          발견된 유해위험요인
          <v-chip color="warning" variant="outlined" class="ml-2">
            {{ analysisData.hazards.length }}개
          </v-chip>
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

      <v-expansion-panels variant="accordion">
        <v-expansion-panel
          v-for="hazard in analysisData.hazards"
          :key="hazard.id"
          class="mb-3"
        >
          <v-expansion-panel-title class="hazard-title">
            <div class="d-flex align-center">
              <v-icon color="warning" class="mr-3">mdi-alert</v-icon>
              <span class="font-weight-medium">{{ hazard.name }}</span>
              <v-chip 
                color="warning" 
                variant="outlined" 
                size="small"
                class="ml-auto"
              >
                {{ hazard.safetyMeasures.length }}개 대책
              </v-chip>
            </div>
          </v-expansion-panel-title>
          
          <v-expansion-panel-text>
            <div class="hazard-description mb-4">
              <p class="text-body-1 mb-0">{{ hazard.description }}</p>
            </div>
            
            <div class="safety-measures">
              <h6 class="text-subtitle-1 mb-3 text-success">
                <v-icon color="success" size="small" class="mr-2">mdi-shield-check</v-icon>
                제안된 안전대책
              </h6>
              
              <v-row>
                <v-col 
                  v-for="measure in hazard.safetyMeasures" 
                  :key="measure.id"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card 
                    class="safety-measure-card pa-3" 
                    variant="outlined"
                    :class="{ 'selected': isMeasureSelected(hazard.id, measure.id) }"
                    @click="toggleMeasureSelection(hazard.id, measure.id)"
                  >
                    <div class="d-flex align-center">
                      <v-checkbox
                        :model-value="isMeasureSelected(hazard.id, measure.id)"
                        color="success"
                        hide-details
                        class="mr-3"
                        @click.stop
                        @update:model-value="toggleMeasureSelection(hazard.id, measure.id)"
                      />
                      <div class="flex-grow-1">
                        <div class="font-weight-medium mb-1">{{ measure.name }}</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ measure.description }}
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- 스텝 바 구조로 변경 -->
    <v-card class="mt-6" variant="outlined">
      <!-- 스텝 바 -->
      <div class="step-progress-container pa-4">
        <div class="d-flex justify-space-between align-center mb-6">
          <h4 class="text-h6 mb-0">진행 단계</h4>
          <v-chip 
            :color="currentStep === 3 ? 'success' : 'primary'"
            variant="outlined"
          >
            {{ currentStep }}/3 단계
          </v-chip>
        </div>
        
        <div class="step-bar">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="step-item"
            :class="{ 
              'completed': currentStep > index + 1, 
              'current': currentStep === index + 1,
              'disabled': currentStep < index + 1
            }"
            @click="goToStep(index + 1)"
          >
            <div class="step-circle">
              <v-icon v-if="currentStep > index + 1" size="20" color="white">
                mdi-check
              </v-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-label">{{ step.label }}</div>
          </div>
        </div>
      </div>

      <!-- 스텝 컨텐츠 -->
      <div class="step-content pa-4">
        <!-- 1단계: 분석 결과 및 선택 -->
        <div v-show="currentStep === 1" class="step-1">
          <div class="text-center mb-4">
            <h4 class="text-h6 mb-2">1단계: 안전대책 선택</h4>
            <p class="text-body-2 text-medium-emphasis">
              위험요인별로 안전대책을 선택해주세요.
            </p>
          </div>
          
          <!-- 선택 진행률 -->
          <v-progress-linear
            :model-value="(totalSelectedMeasures / totalPossibleMeasures) * 100"
            color="success"
            height="8"
            rounded
            class="mb-4"
          />
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-body-2">선택 진행률</span>
            <span class="text-body-2 font-weight-medium">
              {{ totalSelectedMeasures }} / {{ totalPossibleMeasures }}
            </span>
          </div>

          <!-- 다음 단계 버튼 -->
          <div class="text-center mt-6">
            <v-btn
              color="primary"
              size="large"
              :disabled="totalSelectedMeasures === 0"
              @click="nextStep"
            >
              다음 단계
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- 2단계: 선택 요약 -->
        <div v-show="currentStep === 2" class="step-2">
          <div class="d-flex justify-space-between align-center mb-4">
            <h4 class="text-h6 mb-0">2단계: 선택 요약</h4>
            <v-chip 
              :color="totalSelectedMeasures > 0 ? 'success' : 'grey'"
              variant="outlined"
            >
              {{ totalSelectedMeasures }}개 선택됨
            </v-chip>
          </div>
          
          <div v-if="totalSelectedMeasures > 0" class="selected-items">
            <div 
              v-for="hazard in analysisData.hazards" 
              :key="hazard.id"
              v-show="getSelectedMeasuresForHazard(hazard.id).length > 0"
              class="selected-hazard mb-3"
            >
              <div class="d-flex align-center mb-2">
                <v-icon color="warning" size="small" class="mr-2">mdi-alert</v-icon>
                <span class="font-weight-medium">{{ hazard.name }}</span>
              </div>
              <div class="selected-measures">
                <v-chip
                  v-for="measure in getSelectedMeasuresForHazard(hazard.id)"
                  :key="measure.id"
                  color="success"
                  variant="outlined"
                  size="small"
                  class="mr-2 mb-1"
                >
                  {{ measure.name }}
                </v-chip>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center text-medium-emphasis py-8">
            <v-icon color="grey" size="64" class="mb-4">mdi-information</v-icon>
            <p class="mb-0">아직 안전대책을 선택하지 않았습니다.</p>
            <p class="mb-0">1단계로 돌아가서 안전대책을 선택해주세요.</p>
          </div>

          <!-- 단계 이동 버튼 -->
          <div class="d-flex justify-space-between mt-6">
            <v-btn
              color="secondary"
              variant="outlined"
              @click="prevStep"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              이전 단계
            </v-btn>
            <v-btn
              color="primary"
              size="large"
              :disabled="totalSelectedMeasures === 0"
              @click="nextStep"
            >
              다음 단계
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- 3단계: 최종 제출 -->
        <div v-show="currentStep === 3" class="step-3">
          <div class="text-center mb-4">
            <h4 class="text-h6 mb-2">3단계: 최종 제출</h4>
            <p class="text-body-2 text-medium-emphasis">
              선택하신 안전대책을 최종 확인하고 제출하세요.
            </p>
          </div>
          
          <div v-if="totalSelectedMeasures > 0" class="submit-content">
            <!-- 선택 통계 -->
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

            <!-- 제출 버튼 -->
            <div class="text-center">
              <v-btn
                color="success"
                size="x-large"
                @click="proceedToSelection"
                class="px-8"
              >
                <v-icon left>mdi-send</v-icon>
                최종 제출
              </v-btn>
            </div>
          </div>
          
          <div v-else class="text-center text-medium-emphasis py-8">
            <v-icon color="grey" size="64" class="mb-4">mdi-alert-circle</v-icon>
            <p class="mb-0">제출할 수 있는 안전대책이 없습니다.</p>
            <p class="mb-0">1단계로 돌아가서 안전대책을 선택해주세요.</p>
          </div>

          <!-- 이전 단계 버튼 -->
          <div class="text-center mt-6">
            <v-btn
              color="secondary"
              variant="outlined"
              @click="prevStep"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              이전 단계
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
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
  uploadedImage?: File | null
}

const emit = defineEmits<{
  'result-ready': []
}>()

const props = defineProps<Props>()

// 이미지 미리보기 URL
const imagePreview = computed(() => {
  if (!props.uploadedImage) return ''
  return URL.createObjectURL(props.uploadedImage)
})

// 스텝 바 상태 관리
const currentStep = ref(1)

// 스텝 정의
const steps = [
  { id: 1, label: '안전대책 선택' },
  { id: 2, label: '선택 요약' },
  { id: 3, label: '최종 제출' }
]

// 선택된 안전대책 관리
const selectedMeasures = ref<Map<number, Set<number>>>(new Map())

// 선택된 안전대책 개수 계산
const totalSelectedMeasures = computed(() => {
  let total = 0
  selectedMeasures.value.forEach(measures => {
    total += measures.size
  })
  return total
})

// 전체 가능한 안전대책 개수
const totalPossibleMeasures = computed(() => {
  return props.analysisData.hazards.reduce((total, hazard) => {
    return total + hazard.safetyMeasures.length
  }, 0)
})

// 선택된 위험요인 개수
const selectedHazardsCount = computed(() => {
  let count = 0
  props.analysisData.hazards.forEach(hazard => {
    const selectedIds = selectedMeasures.value.get(hazard.id)
    if (selectedIds && selectedIds.size > 0) {
      count++
    }
  })
  return count
})

// 커버리지 퍼센트
const coveragePercentage = computed(() => {
  if (props.analysisData.hazards.length === 0) return 0
  return Math.round((selectedHazardsCount.value / props.analysisData.hazards.length) * 100)
})

// 안전대책 선택 상태 확인
const isMeasureSelected = (hazardId: number, measureId: number): boolean => {
  const hazardMeasures = selectedMeasures.value.get(hazardId)
  return hazardMeasures ? hazardMeasures.has(measureId) : false
}

// 안전대책 선택/해제 토글
const toggleMeasureSelection = (hazardId: number, measureId: number) => {
  if (!selectedMeasures.value.has(hazardId)) {
    selectedMeasures.value.set(hazardId, new Set())
  }
  
  const hazardMeasures = selectedMeasures.value.get(hazardId)!
  
  if (hazardMeasures.has(measureId)) {
    hazardMeasures.delete(measureId)
  } else {
    hazardMeasures.add(measureId)
  }
}

// 전체 안전대책 선택
const selectAllMeasures = () => {
  props.analysisData.hazards.forEach(hazard => {
    if (!selectedMeasures.value.has(hazard.id)) {
      selectedMeasures.value.set(hazard.id, new Set())
    }
    const hazardMeasures = selectedMeasures.value.get(hazard.id)!
    hazard.safetyMeasures.forEach(measure => {
      hazardMeasures.add(measure.id)
    })
  })
}

// 전체 안전대책 해제
const deselectAllMeasures = () => {
  selectedMeasures.value.clear()
}

// 특정 위험요인에 대한 선택된 안전대책 가져오기
const getSelectedMeasuresForHazard = (hazardId: number): SafetyMeasure[] => {
  const hazard = props.analysisData.hazards.find(h => h.id === hazardId)
  if (!hazard) return []
  
  const selectedIds = selectedMeasures.value.get(hazardId)
  if (!selectedIds) return []
  
  return hazard.safetyMeasures.filter(measure => selectedIds.has(measure.id))
}

// 스텝 이동 함수들
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const goToStep = (stepNumber: number) => {
  // 완료된 단계나 현재 단계로만 이동 가능
  if (stepNumber <= currentStep.value) {
    currentStep.value = stepNumber
  }
}

// 다음 단계로 진행
const proceedToSelection = () => {
  // 선택된 데이터를 부모로 전달
  const selectedData = {
    selectedMeasures: selectedMeasures.value,
    hazards: props.analysisData.hazards
  }
  emit('result-ready', selectedData)
}
</script>

<style scoped>
.analysis-result {
  width: 100%;
}

.hazard-title {
  background: var(--v-warning-lighten5);
}

.safety-measure-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.safety-measure-card:hover {
  border-color: var(--v-primary-base);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.safety-measure-card.selected {
  border-color: var(--v-success-base);
  background: var(--v-success-lighten5);
}

.selected-hazard {
  padding: 12px;
  background: var(--v-surface-variant);
  border-radius: 8px;
}

.selected-measures {
  margin-left: 24px;
}

.selection-summary {
  background: var(--v-surface-variant);
}

.analyzed-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
}

.analyzed-image-container .v-img {
  border: 2px solid var(--v-border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 스텝 바 관련 스타일 */
.step-progress-container {
  background: var(--v-surface-variant);
  border-radius: 8px 8px 0 0;
}

.step-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 0 20px;
}

.step-bar::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--v-border-color);
  z-index: 1;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item:hover {
  transform: translateY(-2px);
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid var(--v-border-color);
  background: white;
  color: var(--v-text-medium-emphasis);
}

.step-item.completed .step-circle {
  background: var(--v-success-base);
  border-color: var(--v-success-base);
  color: white;
}

.step-item.current .step-circle {
  background: var(--v-primary-base);
  border-color: var(--v-primary-base);
  color: white;
  box-shadow: 0 0 0 4px var(--v-primary-lighten5);
}

.step-item.disabled .step-circle {
  background: var(--v-surface-variant);
  border-color: var(--v-border-color);
  color: var(--v-text-disabled);
  cursor: not-allowed;
}

.step-label {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: var(--v-text-medium-emphasis);
  max-width: 80px;
}

.step-item.completed .step-label {
  color: var(--v-success-base);
}

.step-item.current .step-label {
  color: var(--v-primary-base);
  font-weight: 600;
}

.step-item.disabled .step-label {
  color: var(--v-text-disabled);
}

.step-content {
  min-height: 300px;
}

.submit-content {
  max-width: 800px;
  margin: 0 auto;
}

.selected-hazard {
  padding: 12px;
  background: var(--v-surface-variant);
  border-radius: 8px;
  border-left: 4px solid var(--v-warning-base);
}

.selected-measures {
  margin-left: 24px;
}
</style>