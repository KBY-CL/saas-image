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
           
           <!-- 연결 테스트 버튼들 (개발용) -->
           <div class="text-center mb-4">
             <div class="d-flex justify-center gap-2 mb-2">
               <v-btn
                 color="info"
                 variant="outlined"
                 size="small"
                 @click="checkNetwork"
               >
                 <v-icon left>mdi-wifi</v-icon>
                 네트워크 확인
               </v-btn>
               <v-btn
                 color="secondary"
                 variant="outlined"
                 size="small"
                 @click="testConnection"
               >
                 <v-icon left>mdi-connection</v-icon>
                 N8N 연결 테스트
               </v-btn>
             </div>
             <div class="text-caption text-medium-emphasis">
               개발 모드: {{ USE_DUMMY_DATA ? '더미 데이터' : '실제 N8N API' }}
             </div>
           </div>

          <!-- 이미지 업로드 영역 -->
          <ImageUploader 
            v-if="!isAnalyzing && !analysisComplete"
            @image-uploaded="handleImageUpload"
          />

                     <!-- AI 분석 진행 중 UI -->
           <AnalysisProgress 
             v-if="isAnalyzing"
             :uploaded-image="uploadedImage"
             :is-analyzing="isAnalyzing"
             @analysis-complete="handleAnalysisComplete"
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
import { requestImageAnalysis, testN8NConnection, checkInternetConnection, type ImageAnalysisResponse } from '../utils/n8n-api'

// 상태 관리
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const uploadedImage = ref<File | null>(null)

// 개발 모드 설정 (N8N API 테스트용)
// 🚀 N8N API 연동 테스트 시 이 값을 false로 변경하세요
// true: 더미 데이터 사용 (개발/테스트용)
// false: 실제 N8N API 사용 (운영용)
// 🧪 실제 N8N 전송 테스트를 위해 false로 설정
const USE_DUMMY_DATA = false

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
const handleImageUpload = async (imageFile: File) => {
  uploadedImage.value = imageFile
  isAnalyzing.value = true
  
     try {
     console.log('이미지 분석 시작:', {
       fileName: imageFile.name,
       fileSize: imageFile.size,
       fileType: imageFile.type,
       useDummyData: USE_DUMMY_DATA
     })
     
     if (USE_DUMMY_DATA) {
       // 더미 데이터 모드: 7초 후 완료
       console.log('더미 데이터 모드로 진행합니다.')
       await new Promise(resolve => setTimeout(resolve, 7000))
       
       // 더미 데이터 사용
       console.log('더미 데이터로 분석 완료')
     } else {
       // 실제 N8N API 모드
       console.log('실제 N8N API로 분석을 요청합니다.')
       
       // N8N Webhook으로 이미지 분석 요청
       const response: ImageAnalysisResponse = await requestImageAnalysis(imageFile)
       
       console.log('N8N API 응답:', response)
       
       if (response.success && response.analysisData) {
         // 분석 성공 시 데이터 업데이트
         Object.assign(analysisData, response.analysisData)
         console.log('AI 분석 완료:', response.analysisData)
       } else {
         // 분석 실패 시 에러 처리
         console.error('AI 분석 실패 - 전체 응답:', response)
         const errorMessage = response.error || '알 수 없는 오류가 발생했습니다.'
         console.error('에러 메시지:', errorMessage)
         alert(`AI 분석에 실패했습니다: ${errorMessage}`)
         
         // 에러 발생 시 더미 데이터로 계속 진행 (테스트용)
         console.log('더미 데이터로 계속 진행합니다.')
       }
     }
   } catch (error) {
     console.error('이미지 분석 요청 중 오류:', error)
     console.error('에러 타입:', typeof error)
     console.error('에러 객체:', error)
     
     let errorMessage = '이미지 분석 요청 중 오류가 발생했습니다.'
     if (error instanceof Error) {
       errorMessage = error.message
     }
     
     alert(errorMessage)
     
     // 에러 발생 시 더미 데이터로 계속 진행 (테스트용)
     console.log('더미 데이터로 계속 진행합니다.')
   } finally {
    // 분석 완료 상태로 변경
    isAnalyzing.value = false
    analysisComplete.value = true
    
    // 진행률을 100%로 완료 (AnalysisProgress 컴포넌트에 이벤트 전달)
    // 실제로는 AnalysisProgress 컴포넌트에서 progressValue를 100%로 설정
  }
}

// 네트워크 상태 확인
const checkNetwork = async () => {
  console.log('🌐 네트워크 연결 상태 확인 중...')
  const isInternetConnected = await checkInternetConnection()
  
  if (isInternetConnected) {
    alert('✅ 인터넷 연결 정상!')
  } else {
    alert('❌ 인터넷 연결 실패! 네트워크 상태를 확인하세요.')
  }
}

// N8N 연결 테스트
const testConnection = async () => {
  console.log('🔍 N8N Webhook 연결 테스트 시작')
  
  // 먼저 인터넷 연결 확인
  const isInternetConnected = await checkInternetConnection()
  if (!isInternetConnected) {
    alert('❌ 인터넷 연결이 없습니다. 네트워크 상태를 확인하세요.')
    return
  }
  
  const isConnected = await testN8NConnection()
  
  if (isConnected) {
    alert('✅ N8N Webhook 연결 성공!')
  } else {
    alert('❌ N8N Webhook 연결 실패! 브라우저 콘솔을 확인하세요.')
  }
}

// 분석 완료 처리
const handleAnalysisComplete = () => {
  console.log('AI 분석 진행 UI 완료')
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
