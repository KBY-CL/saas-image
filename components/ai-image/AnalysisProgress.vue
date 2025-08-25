<!--
 * AI 분석 진행 중 UI 컴포넌트
 * 이미지가 AI에 의해 분석되고 있다는 것을 시각적으로 표현
 -->
<template>
  <div class="analysis-progress">
    <!-- 업로드된 이미지 표시 -->
    <div class="text-center mb-6">
      <v-avatar size="120" class="mb-4">
        <v-img 
          :src="imagePreview" 
          alt="분석 중인 이미지"
          cover
        />
      </v-avatar>
      <h3 class="text-h5 mb-2">이미지 분석 중...</h3>
      <p class="text-body-1 text-medium-emphasis">
        AI가 이미지를 스캔하고 안전 위험요인을 분석하고 있습니다
      </p>
    </div>

    <!-- 스캔 애니메이션 -->
    <div class="scan-animation-container mb-6">
      <div class="scan-line"></div>
      <div class="scan-overlay">
        <div class="scan-grid">
          <div class="grid-line horizontal" v-for="i in 5" :key="`h-${i}`"></div>
          <div class="grid-line vertical" v-for="i in 5" :key="`v-${i}`"></div>
        </div>
      </div>
    </div>

    <!-- 진행 상태 표시 -->
    <div class="progress-status">
      <v-progress-linear
        :model-value="progressValue"
        color="primary"
        height="8"
        rounded
        class="mb-4"
      />
      
      <div class="d-flex justify-space-between align-center mb-4">
        <span class="text-body-2">분석 진행률</span>
        <span class="text-body-2 font-weight-medium">{{ Math.round(progressValue) }}%</span>
      </div>

      <!-- 단계별 진행 상태 -->
      <div class="analysis-steps">
        <div 
          v-for="(step, index) in analysisSteps" 
          :key="step.id"
          class="analysis-step"
          :class="{ 'completed': step.completed, 'current': step.current }"
        >
          <div class="step-icon">
            <v-icon 
              :icon="step.completed ? 'mdi-check-circle' : 'mdi-circle-outline'"
              :color="step.completed ? 'success' : step.current ? 'primary' : 'grey'"
              size="24"
            />
          </div>
          <div class="step-content">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 로봇 애니메이션 -->
    <div class="ai-robot-container">
      <div class="ai-robot">
        <v-icon size="48" color="primary" class="robot-icon">
          mdi-robot
        </v-icon>
        <div class="robot-status">
          <div class="status-dot"></div>
          <span class="status-text">AI 분석 중...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Props
interface Props {
  uploadedImage: File | null
  isAnalyzing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAnalyzing: true
})

// Emits
const emit = defineEmits<{
  'analysis-complete': []
}>()

// 상태 관리
const progressValue = ref(0)
const currentStepIndex = ref(0)

// 분석 단계 정의
const analysisSteps = ref([
  { id: 1, title: '이미지 전처리', description: '이미지 품질 개선 및 최적화', completed: false, current: false },
  { id: 2, title: '객체 인식', description: '작업 현장의 물체 및 상황 인식', completed: false, current: false },
  { id: 3, title: '위험요인 분석', description: '안전 위험요인 식별 및 분석', completed: false, current: false },
  { id: 4, title: '안전대책 생성', description: '위험요인별 안전대책 도출', completed: false, current: false },
  { id: 5, title: '결과 정리', description: '최종 분석 결과 정리 및 요약', completed: false, current: false }
])

// 이미지 미리보기 URL
const imagePreview = computed(() => {
  if (!props.uploadedImage) return ''
  return URL.createObjectURL(props.uploadedImage)
})

// 진행률 및 단계 업데이트
let progressInterval: NodeJS.Timeout
let stepInterval: NodeJS.Timeout

onMounted(() => {
  // 진행률 애니메이션 (실제 분석 시간에 따라 조정)
  progressInterval = setInterval(() => {
    if (progressValue.value < 90) { // 90%까지만 진행 (실제 완료는 부모 컴포넌트에서 제어)
      progressValue.value += 0.5 // 더 부드러운 진행
    }
  }, 100)

  // 단계별 진행 (더 자연스러운 타이밍)
  stepInterval = setInterval(() => {
    if (currentStepIndex.value < analysisSteps.value.length) {
      // 이전 단계 완료
      if (currentStepIndex.value > 0) {
        analysisSteps.value[currentStepIndex.value - 1].completed = true
        analysisSteps.value[currentStepIndex.value - 1].current = false
      }
      
      // 현재 단계 활성화
      analysisSteps.value[currentStepIndex.value].current = true
      currentStepIndex.value++
    }
  }, 2000) // 2초마다 단계 변경
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
  if (stepInterval) clearInterval(stepInterval)
})

// isAnalyzing 상태 변화 감지
watch(() => props.isAnalyzing, (newValue) => {
  if (!newValue) {
    // 분석이 완료되면 진행률을 100%로 설정
    progressValue.value = 100
    
    // 모든 단계를 완료 상태로 설정
    analysisSteps.value.forEach(step => {
      step.completed = true
      step.current = false
    })
    
    // 분석 완료 이벤트 발생
    emit('analysis-complete')
  }
})
</script>

<style scoped>
.analysis-progress {
  text-align: center;
}

.scan-animation-container {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, var(--v-surface-variant) 0%, var(--v-primary-lighten5) 100%);
  border-radius: 12px;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--v-primary-base), transparent);
  animation: scanMove 2s ease-in-out infinite;
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-grid {
  position: relative;
  width: 80%;
  height: 80%;
}

.grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  animation: gridPulse 3s ease-in-out infinite;
}

.grid-line.horizontal {
  width: 100%;
  height: 1px;
}

.grid-line.vertical {
  width: 1px;
  height: 100%;
}

.grid-line:nth-child(1) { top: 0; animation-delay: 0s; }
.grid-line:nth-child(2) { top: 25%; animation-delay: 0.5s; }
.grid-line:nth-child(3) { top: 50%; animation-delay: 1s; }
.grid-line:nth-child(4) { top: 75%; animation-delay: 1.5s; }
.grid-line:nth-child(5) { top: 100%; animation-delay: 2s; }

.grid-line:nth-child(6) { left: 0; animation-delay: 0.2s; }
.grid-line:nth-child(7) { left: 25%; animation-delay: 0.7s; }
.grid-line:nth-child(8) { left: 50%; animation-delay: 1.2s; }
.grid-line:nth-child(9) { left: 75%; animation-delay: 1.7s; }
.grid-line:nth-child(10) { left: 100%; animation-delay: 2.2s; }

@keyframes scanMove {
  0%, 100% { transform: translateY(0); opacity: 0; }
  50% { transform: translateY(200px); opacity: 1; }
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.analysis-steps {
  text-align: left;
  margin-top: 24px;
}

.analysis-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.analysis-step.completed {
  background: var(--v-success-lighten5);
}

.analysis-step.current {
  background: var(--v-primary-lighten5);
}

.step-icon {
  margin-right: 16px;
  margin-top: 2px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.step-description {
  font-size: 0.875rem;
  color: var(--v-text-medium-emphasis);
}

.ai-robot-container {
  margin-top: 32px;
}

.ai-robot {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: var(--v-surface-variant);
}

.robot-status {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--v-primary-base);
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 1.5s ease-in-out infinite;
}

.status-text {
  font-size: 0.875rem;
  color: var(--v-text-medium-emphasis);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>