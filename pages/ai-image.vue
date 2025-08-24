<!--
 * AI 이미지 분석 페이지
 * 사용자가 이미지를 업로드하면 AI가 분석하여 유해위험요인과 안전대책을 제공
 -->
<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6" elevation="8">
          <!-- 페이지 제목 -->
          <v-card-title class="text-h4 text-center mb-6 primary--text">
            <v-icon large class="mr-3">mdi-robot</v-icon>
            AI 이미지 안전 분석
          </v-card-title>

          <!-- 이미지 업로드 영역 -->
          <ImageUploader 
            v-if="!isAnalyzing && !analysisComplete"
            @image-uploaded="handleImageUpload"
          />

          <!-- AI 분석 진행 중 UI -->
          <AnalysisProgress 
            v-if="isAnalyzing"
            :uploaded-image="uploadedImage"
          />

          <!-- 분석 결과 및 선택 UI -->
          <div v-if="analysisComplete">
            <AnalysisResult 
              :analysis-data="analysisData"
              :uploaded-image="uploadedImage"
              @result-ready="handleResultReady"
            />
            

          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// 페이지 메타데이터 설정
definePageMeta({
  layout: 'ai-image'
})

import { ref, reactive } from 'vue'
import ImageUploader from '../components/ai-image/ImageUploader.vue'
import AnalysisProgress from '../components/ai-image/AnalysisProgress.vue'
import AnalysisResult from '../components/ai-image/AnalysisResult.vue'

// 상태 관리
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const uploadedImage = ref<File | null>(null)

// 더미 분석 데이터
const analysisData = reactive({
  imageDescription: '업로드된 이미지에서 작업 현장의 안전 상태를 분석했습니다.',
  hazards: [
    {
      id: 1,
      name: '높은 곳에서의 작업',
      description: '2층 높이에서 안전장비 없이 작업하는 상황',
      safetyMeasures: [
        { id: 1, name: '안전헬멧 착용', description: '충격에 강한 안전헬멧을 반드시 착용' },
        { id: 2, name: '안전벨트 사용', description: '추락 방지를 위한 안전벨트 착용' },
        { id: 3, name: '안전발판 설치', description: '안정적인 작업을 위한 안전발판 설치' }
      ]
    },
    {
      id: 2,
      name: '전기 작업 위험',
      description: '전기 배선 작업 시 절연장비 미착용',
      safetyMeasures: [
        { id: 4, name: '절연장갑 착용', description: '전기 충격 방지를 위한 절연장갑 사용' },
        { id: 5, name: '절연신발 착용', description: '접지 전류로부터 보호하는 절연신발' }
      ]
    },
    {
      id: 3,
      name: '화학물질 노출',
      description: '유해화학물질 취급 시 보호장비 부족',
      safetyMeasures: [
        { id: 6, name: '방독면 착용', description: '유해가스로부터 호흡기 보호' },
        { id: 7, name: '보호복 착용', description: '화학물질로부터 피부 보호' },
        { id: 8, name: '보호안경 착용', description: '화학물질로부터 눈 보호' },
        { id: 9, name: '안전장갑 착용', description: '화학물질로부터 손 보호' }
      ]
    }
  ]
})

// 이미지 업로드 처리
const handleImageUpload = (imageFile: File) => {
  uploadedImage.value = imageFile
  isAnalyzing.value = true
  
  // 7초 후 분석 완료 시뮬레이션
  setTimeout(() => {
    isAnalyzing.value = false
    analysisComplete.value = true
  }, 7000)
}

// 결과 준비 완료 처리
const handleResultReady = (selectedData: any) => {
  console.log('선택된 데이터:', selectedData)
}

// 선택 완료 처리
const handleSelectionComplete = (selectedData: any) => {
  console.log('최종 선택된 데이터:', selectedData)
  // TODO: 외부 웹사이트로 데이터 전송
  alert('선택이 완료되었습니다. 외부 시스템으로 전송됩니다.')
}
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}

.primary--text {
  color: var(--v-primary-base) !important;
}
</style>
