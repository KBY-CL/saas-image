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
          이 이미지를 기반으로 클라우드랩 AI가 안전 위험요인을 분석했습니다.
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
          유해위험요인
          <v-chip color="warning" variant="outlined" class="ml-2">
            {{ analysisData.hazards.length }}개
          </v-chip>
        </h4>
        
        <!-- 전체선택/해제/다시분석 버튼 -->
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
            class="mr-2"
            @click="deselectAllMeasures"
          >
            <v-icon left size="small">mdi-close-box-multiple</v-icon>
            전체해제
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="handleRedoAnalysis"
            :loading="isRedoAnalyzing"
          >
            <v-icon left size="small">mdi-refresh</v-icon>
            다시분석
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
              <span class="font-weight-medium mr-4">{{ hazard.name }}</span>
              <v-chip 
                color="warning" 
                variant="outlined" 
                size="small"
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
                위험성감소대책
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
                    <div class="d-flex align-start">
                      <v-checkbox
                        :model-value="isMeasureSelected(hazard.id, measure.id)"
                        color="success"
                        hide-details
                        class="mr-4 mt-1"
                        @click.stop
                        @update:model-value="toggleMeasureSelection(hazard.id, measure.id)"
                      />
                      <div class="flex-grow-1">
                        <div class="font-weight-medium mb-2">{{ measure.name }}</div>
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

    <!-- 선택 요약 및 제출 (선택된 항목이 있을 때만 표시) -->
    <v-card v-if="totalSelectedMeasures > 0" class="mt-6 pa-6" variant="outlined">
      <div class="text-center mb-6">
        <h4 class="text-h6 mb-2">선택 요약</h4>
        <p class="text-body-2 text-medium-emphasis">
          선택하신 안전대책을 확인하고 제출하세요.
        </p>
      </div>

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

      <!-- 선택된 항목 상세 -->
      <div class="selected-items mb-6">
        <h5 class="text-h6 mb-3">선택된 안전대책</h5>
        <div 
          v-for="hazard in analysisData.hazards" 
          :key="hazard.id"
          v-show="getSelectedMeasuresForHazard(hazard.id).length > 0"
          class="selected-hazard mb-3 pa-3"
          style="background-color: rgba(76, 175, 80, 0.1); border-radius: 8px;"
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

      <!-- 제출 버튼 -->
      <div class="text-center">
        <v-btn
          color="success"
          size="x-large"
          @click="proceedToSelection"
          class="px-8"
        >
          <v-icon class="mr-2">mdi-check</v-icon>
          확인
        </v-btn>
      </div>
    </v-card>

    <!-- 선택 안내 메시지 (선택된 항목이 없을 때만 표시) -->
    <div v-if="totalSelectedMeasures === 0" class="text-center pa-8 mt-6">
      <v-icon color="grey" size="64" class="mb-4">mdi-information-outline</v-icon>
      <h5 class="text-h6 mb-2 text-grey">위험성감소대책을 선택해주세요</h5>
      <p class="text-body-2 text-medium-emphasis">
        위의 유해위험요인에서 필요한 위험성감소대책을 체크해주세요.<br>
        선택하시면 선택 요약이 표시됩니다.
      </p>
    </div>
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
  uploadedImage: File | null
  imgUrl?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'result-ready': [selectedData: any]
  'redo-analysis': []
}>()

// 상태 관리
const selectedMeasures = ref<Map<string, boolean>>(new Map())
const isRedoAnalyzing = ref(false)

// 이미지 미리보기 URL
const imagePreview = computed(() => {
  if (props.uploadedImage) {
    return URL.createObjectURL(props.uploadedImage)
  }
  return ''
})

// 선택된 안전대책 수
const totalSelectedMeasures = computed(() => {
  let count = 0
  selectedMeasures.value.forEach(isSelected => {
    if (isSelected) count++
  })
  return count
})

// 선택된 위험요인 수
const selectedHazardsCount = computed(() => {
  const selectedHazards = new Set()
  selectedMeasures.value.forEach((isSelected, key) => {
    if (isSelected) {
      const [hazardId] = key.split('-')
      selectedHazards.add(hazardId)
    }
  })
  return selectedHazards.size
})

// 전체 가능한 안전대책 수
const totalPossibleMeasures = computed(() => {
  return props.analysisData.hazards.reduce((total, hazard) => {
    return total + hazard.safetyMeasures.length
  }, 0)
})

// 위험요인 커버리지 퍼센트
const coveragePercentage = computed(() => {
  if (props.analysisData.hazards.length === 0) return 0
  return Math.round((selectedHazardsCount.value / props.analysisData.hazards.length) * 100)
})

// 안전대책 선택 여부 확인
const isMeasureSelected = (hazardId: number, measureId: number): boolean => {
  const key = `${hazardId}-${measureId}`
  return selectedMeasures.value.get(key) || false
}

// 안전대책 선택/해제 토글
const toggleMeasureSelection = (hazardId: number, measureId: number) => {
  const key = `${hazardId}-${measureId}`
  const currentValue = selectedMeasures.value.get(key) || false
  selectedMeasures.value.set(key, !currentValue)
}

// 특정 위험요인의 선택된 안전대책 목록
const getSelectedMeasuresForHazard = (hazardId: number): SafetyMeasure[] => {
  const hazard = props.analysisData.hazards.find(h => h.id === hazardId)
  if (!hazard) return []
  
  return hazard.safetyMeasures.filter(measure => {
    const key = `${hazardId}-${measure.id}`
    return selectedMeasures.value.get(key) || false
  })
}

// 전체 선택
const selectAllMeasures = () => {
  props.analysisData.hazards.forEach(hazard => {
    hazard.safetyMeasures.forEach(measure => {
      const key = `${hazard.id}-${measure.id}`
      selectedMeasures.value.set(key, true)
    })
  })
}

// 전체 해제
const deselectAllMeasures = () => {
  selectedMeasures.value.clear()
}

// 다시분석 요청
const handleRedoAnalysis = async () => {
  if (!props.imgUrl) {
    alert('이미지 URL이 없어 다시분석을 할 수 없습니다.')
    return
  }

  try {
    isRedoAnalyzing.value = true
    
    // 부모 컴포넌트에 다시분석 요청 이벤트 발생
    emit('redo-analysis')
    
    console.log('🔄 다시분석 요청:', props.imgUrl)
    
  } catch (error) {
    console.error('❌ 다시분석 요청 실패:', error)
    alert('다시분석 요청 중 오류가 발생했습니다.')
  } finally {
    isRedoAnalyzing.value = false
  }
}

// 선택 완료 및 제출
const proceedToSelection = () => {
  if (totalSelectedMeasures.value === 0) {
    alert('안전대책을 하나 이상 선택해주세요.')
    return
  }

  // 선택된 데이터 구성
  const selectedData = {
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    selectedHazards: props.analysisData.hazards.map(hazard => ({
      id: hazard.id,
      name: hazard.name,
      description: hazard.description,
      selectedMeasures: getSelectedMeasuresForHazard(hazard.id)
    })).filter(hazard => hazard.selectedMeasures.length > 0),
    totalSelectedMeasures: totalSelectedMeasures.value,
    coveragePercentage: coveragePercentage.value
  }

  console.log('선택된 데이터:', selectedData)
  
  // 부모 컴포넌트로 데이터 전달
  emit('result-ready', selectedData)
  
  // 제출 완료 알림
  alert('선택이 완료되었습니다. 외부 시스템으로 전송됩니다.')
}
</script>

<style scoped>
.analysis-result {
  max-width: 100%;
}

.hazard-title {
  font-weight: 500;
}

.safety-measure-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  min-height: 80px;
}

.safety-measure-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.safety-measure-card.selected {
  border-color: var(--v-success-base);
  background-color: rgba(76, 175, 80, 0.05);
}

.safety-measure-card .v-checkbox {
  flex-shrink: 0;
}

.selected-hazard {
  border-left: 4px solid var(--v-success-base);
}

.analyzed-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>