<!--
 * AI 분석 진행 중 UI 컴포넌트
 * 이미지가 AI에 의해 분석되고 있다는 것을 시각적으로 표현
 -->
<template>
  <div class="analysis-progress">
    <!-- 업로드된 이미지 표시 -->
    <v-card class="text-center mb-6 pa-6" variant="outlined">
      <v-avatar size="120" class="mb-4">
        <v-img 
          :src="imagePreview" 
          alt="분석 중인 이미지"
          cover
        />
      </v-avatar>
      <h3 class="text-h5 mb-2">이미지 분석 중...</h3>
      <p class="text-body-1 text-medium-emphasis">
        N8N에서 AI가 이미지를 분석하고 있습니다<br>
        분석이 완료될 때까지 잠시만 기다려주세요 (최대 10분)
      </p>
    </v-card>

                    <!-- 이미지 픽셀화/모자이크 스캔 애니메이션 -->
                <v-card class="image-scan-container mb-6 pa-6" variant="outlined">
                  <div class="scanning-image-wrapper">
                    <v-img 
                      :src="imagePreview" 
                      alt="스캔 중인 이미지"
                      class="scanning-image"
                      cover
                    />
                    <div class="pixel-overlay"></div>
                    <div class="scan-overlay-effect">
                      <div class="scan-line-horizontal"></div>
                      <div class="scan-line-vertical"></div>
                      <div class="scan-corners">
                        <div class="corner top-left"></div>
                        <div class="corner top-right"></div>
                        <div class="corner bottom-left"></div>
                        <div class="corner bottom-right"></div>
                      </div>
                    </div>
                    
                    <!-- 이미지 위의 원형 프로그레스 바 -->
                    <div class="circular-progress-overlay">
                      <div class="progress-circle">
                        <svg class="progress-ring" width="120" height="120">
                          <circle
                            class="progress-ring-circle-bg"
                            stroke-width="8"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                          />
                          <circle
                            class="progress-ring-circle"
                            stroke-width="8"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="strokeDashoffset"
                          />
                        </svg>
                        <div class="progress-text">
                          <span class="progress-percentage">{{ Math.round(progressValue) }}%</span>
                          <span class="progress-label">분석 중</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>

      <!-- 단계별 진행 상태 -->
      <v-card class="analysis-steps pa-6" variant="outlined">
        <h4 class="text-h6 mb-4 text-center">AI 분석 진행 단계</h4>
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
          <div class="step-progress">
            <v-progress-circular
              :model-value="getStepProgress(step)"
              :color="step.completed ? 'success' : step.current ? 'success' : 'grey'"
              :size="32"
              :width="3"
              :indeterminate="step.current"
            />
          </div>
        </div>
      </v-card>
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

// 원형 프로그레스 바 계산
const radius = 52
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => {
  return circumference - (progressValue.value / 100) * circumference
})

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

// 각 단계별 진행률 계산
const getStepProgress = (step: any) => {
  if (step.completed) return 100
  if (step.current) return 50 // 현재 진행 중인 단계는 50%로 표시
  return 0
}

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
        const prevStep = analysisSteps.value[currentStepIndex.value - 1]
        if (prevStep) {
          prevStep.completed = true
          prevStep.current = false
        }
      }
      
      // 현재 단계 활성화
      const currentStep = analysisSteps.value[currentStepIndex.value]
      if (currentStep) {
        currentStep.current = true
        currentStepIndex.value++
      }
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

.image-scan-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
}

.scanning-image-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.scanning-image {
  width: 100%;
  height: 100%;
  filter: blur(8px);
  transition: filter 8s ease-in-out;
  animation: imageClarify 8s ease-in-out forwards;
}

.pixel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 4px,
      rgba(0, 0, 0, 0.1) 4px,
      rgba(0, 0, 0, 0.1) 8px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 4px,
      rgba(0, 0, 0, 0.1) 4px,
      rgba(0, 0, 0, 0.1) 8px
    );
  background-size: 16px 16px, 16px 16px;
  background-position: 0 0, 0 0;
  animation: pixelate 8s ease-in-out forwards;
  pointer-events: none;
}

.scan-overlay-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.scan-line-horizontal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--v-primary-base), transparent);
  animation: scanHorizontal 2s ease-in-out infinite;
}

.scan-line-vertical {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--v-primary-base), transparent);
  animation: scanVertical 2s ease-in-out infinite;
}

.scan-corners {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--v-primary-base);
  animation: cornerPulse 2s ease-in-out infinite;
}

.corner.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

@keyframes imageClarify {
  0% { 
    filter: blur(8px);
  }
  25% { 
    filter: blur(6px);
  }
  50% { 
    filter: blur(4px);
  }
  75% { 
    filter: blur(2px);
  }
  100% { 
    filter: blur(0px);
  }
}

@keyframes pixelate {
  0% { 
    background-size: 32px 32px, 32px 32px;
    opacity: 0.9;
  }
  25% { 
    background-size: 24px 24px, 24px 24px;
    opacity: 0.7;
  }
  50% { 
    background-size: 16px 16px, 16px 16px;
    opacity: 0.5;
  }
  75% { 
    background-size: 8px 8px, 8px 8px;
    opacity: 0.3;
  }
  100% { 
    background-size: 4px 4px, 4px 4px;
    opacity: 0;
  }
}

@keyframes scanHorizontal {
  0%, 100% { transform: translateY(0); opacity: 0; }
  50% { transform: translateY(300px); opacity: 1; }
}

@keyframes scanVertical {
  0%, 100% { transform: translateX(0); opacity: 0; }
  50% { transform: translateX(300px); opacity: 1; }
}

@keyframes cornerPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* 원형 프로그레스 바 스타일 */
.circular-progress-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  position: absolute;
  transform: rotate(-90deg);
}

.progress-ring-circle-bg {
  stroke: rgba(255, 152, 0, 0.2);
}

.progress-ring-circle {
  stroke: #FF9800;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
  filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.6));
}

.progress-text {
  position: absolute;
  text-align: center;
  color: #FF9800;
  font-weight: bold;
}

.progress-percentage {
  display: block;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 4px;
  text-shadow: 0 0 8px rgba(255, 152, 0, 0.6);
}

.progress-label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  text-shadow: 0 0 4px rgba(255, 152, 0, 0.4);
}

/* 단계별 진행 상태 스타일 */
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

.step-progress {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

</style>