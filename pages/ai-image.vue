<!--
 * AI 이미지 분석 페이지
 * 사용자가 이미지를 업로드하면 AI가 분석하여 유해위험요인과 안전대책을 제공
 -->
<template>
  <div class="ai-image-page">
    <!-- 배경 이미지 -->
    <div class="background-image"></div>
    
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" md="8" lg="6">
          <v-card class="pa-6" elevation="8">
                     
           
           

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
                 :img-url="image_Url"
                 @result-ready="handleResultReady"
                 @redo-analysis="handleRedoAnalysis"
               />
              
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
import { requestImageAnalysis, testN8NConnection, checkInternetConnection, N8N_REDO_WEBHOOK_URL, type ImageAnalysisResponse } from '../utils/n8n-api'

// 상태 관리
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const uploadedImage = ref<File | null>(null)
const image_Url = ref<string>('')

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
        
        try {
          // N8N Webhook으로 이미지 분석 요청 (5분 타임아웃)
          console.log('🔄 N8N에서 이미지 분석을 진행 중입니다. 잠시만 기다려주세요...')
          
          const response: ImageAnalysisResponse = await requestImageAnalysis(imageFile)
          
                     console.log('N8N API 응답:', response)
           console.log('🔍 response 전체 구조:', JSON.stringify(response, null, 2))
           console.log('🔍 response.analysisData 타입:', typeof response.analysisData)
           console.log('🔍 response.analysisData 값:', response.analysisData)
          
          // N8N 응답 데이터 구조에 맞게 처리
          try {
            console.log('🔍 N8N 응답 구조 분석 시작...')
            
            let parsedData = null
            
            // N8N 응답이 배열 형태인 경우 (All incoming items 방식)
            if (Array.isArray(response) && response.length > 0) {
              console.log('🔍 N8N 배열 응답 감지, 길이:', response.length)
              console.log('🔍 첫 번째 요소:', response[0])
              
              // output.analysisData 구조 확인
              if (response[0].output && response[0].output.analysisData) {
                console.log('✅ output.analysisData에서 데이터 발견')
                parsedData = response[0].output.analysisData
              } else if (response[0].output && response[0].output.hazards) {
                // 직접 hazards 배열이 있는 경우
                console.log('✅ output.hazards에서 데이터 발견')
                parsedData = {
                  imageDescription: 'N8N에서 분석된 이미지의 안전 위험요인을 식별했습니다.',
                  hazards: response[0].output.hazards
                }
              } else {
                console.log('🔍 output 구조 분석 중...')
                console.log('🔍 response[0].output의 키들:', Object.keys(response[0].output || {}))
                
                // 다른 구조일 수 있음
                if (response[0].hazards) {
                  console.log('✅ 직접 hazards 배열 발견')
                  parsedData = {
                    imageDescription: 'N8N에서 분석된 이미지의 안전 위험요인을 식별했습니다.',
                    hazards: response[0].hazards
                  }
                }
              }
            } else if (response.analysisData) {
              // 기존 구조 유지 (하위 호환성)
              console.log('✅ response.analysisData에서 데이터 발견')
              parsedData = response.analysisData
            }
            
            // 데이터 검증 및 처리
            if (parsedData && parsedData.imageDescription && parsedData.hazards) {
              Object.assign(analysisData, parsedData)
              
                             // N8N 응답에서 image_Url 추출 및 저장
               if (response[0]?.output?.imgUrl) {
                 image_Url.value = response[0].output.imgUrl
                 console.log('✅ image_Url 저장:', image_Url.value)
               } else if (response.imgUrl) {
                 image_Url.value = response.imgUrl
                 console.log('✅ image_Url 저장:', image_Url.value)
               }
              
              console.log('✅ 최종 파싱된 분석 데이터:', parsedData)
              console.log('✅ hazards 개수:', parsedData.hazards.length)
              console.log('✅ AI 분석 완료!')
            } else {
              console.error('❌ 데이터 구조 검증 실패')
              console.error('parsedData:', parsedData)
              console.error('imageDescription 존재:', !!parsedData?.imageDescription)
              console.error('hazards 존재:', !!parsedData?.hazards)
              
              // 실제 필드명 확인
              if (parsedData) {
                console.error('🔍 실제 존재하는 필드들:')
                Object.keys(parsedData).forEach(key => {
                  console.error(`  - ${key}:`, parsedData[key])
                })
              }
              
              throw new Error('분석 데이터 구조가 올바르지 않습니다.')
            }
          } catch (parseError) {
            console.error('❌ 데이터 파싱 실패:', parseError)
            console.error('원본 데이터:', response)
            
            // 파싱 실패 시 더미 데이터로 계속 진행
            alert(`AI 분석 결과를 처리하는 중 오류가 발생했습니다.\n\n에러: ${parseError.message}\n\n더미 데이터로 계속 진행합니다.`)
            console.log('더미 데이터로 계속 진행합니다.')
          }
                      // N8N 응답 처리 완료 (성공/실패 모두 위의 try-catch에서 처리됨)
                 } catch (apiError) {
           console.error('❌ N8N API 호출 중 오류:', apiError)
           
           // 에러 타입별 상세 분석
           let errorMessage = 'N8N 서버와의 통신에 실패했습니다.'
           
           if (apiError instanceof SyntaxError && apiError.message.includes('Unexpected end of JSON input')) {
             errorMessage = `N8N 응답이 올바르지 않습니다.\n\n에러: ${apiError.message}\n\nN8N 워크플로우에서 다음을 확인해주세요:\n1. "Respond to Webhook" 노드의 Response Body가 올바른 JSON인지\n2. "Basic LLM Chain1" 노드에서 output 데이터가 생성되는지\n3. 워크플로우가 정상적으로 실행되는지`
           } else if (apiError instanceof TypeError && apiError.message.includes('Failed to fetch')) {
             errorMessage = `N8N 서버에 연결할 수 없습니다.\n\n에러: ${apiError.message}\n\nN8N 서버 상태와 웹훅 URL을 확인해주세요.`
           } else {
             errorMessage = `N8N API 호출 중 오류가 발생했습니다.\n\n에러: ${apiError.message}`
           }
           
           // 사용자에게 상세한 에러 메시지 표시
           alert(errorMessage)
           
           // API 에러 발생 시 더미 데이터로 계속 진행 (테스트용)
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

// 다시분석 요청 처리
const handleRedoAnalysis = async () => {
  if (!image_Url.value) {
    alert('이미지 URL이 없어 다시분석을 할 수 없습니다.')
    return
  }

  try {
    console.log('🔄 다시분석 요청 시작:', image_Url.value)
    
    // 분석 상태 초기화
    isAnalyzing.value = true
    analysisComplete.value = false
    
    // N8N 재분석 API 호출
    console.log('📤 재분석 요청 데이터:', { imgUrl: image_Url.value })
    
    // FormData 형태로 전송 (이미지 분석과 동일한 구조)
    const formData = new FormData()
    formData.append('imgUrl', image_Url.value)
    formData.append('timestamp', new Date().toISOString())
    formData.append('requestId', `redo_${Date.now()}`)
    
    const response = await fetch(N8N_REDO_WEBHOOK_URL, {
      method: 'POST',
      body: formData
    })

    console.log('📥 재분석 응답 상태:', response.status, response.statusText)
    
    if (!response.ok) {
      // 응답 본문을 읽어서 더 자세한 에러 정보 확인
      let errorDetail = ''
      try {
        const errorResponse = await response.text()
        errorDetail = `\n응답 내용: ${errorResponse}`
      } catch (e) {
        errorDetail = '\n응답 내용을 읽을 수 없습니다.'
      }
      
      throw new Error(`HTTP error! status: ${response.status}${errorDetail}`)
    }

    const result = await response.json()
    console.log('✅ 다시분석 응답:', result)
    
    // 재분석 결과 처리 (이미지 분석과 동일한 구조)
    try {
      let parsedData = null
      
      // N8N 응답이 배열 형태인 경우 (All incoming items 방식)
      if (Array.isArray(result) && result.length > 0) {
        console.log('🔍 재분석 배열 응답 감지, 길이:', result.length)
        
        if (result[0].output && result[0].output.analysisData) {
          console.log('✅ output.analysisData에서 데이터 발견')
          parsedData = result[0].output.analysisData
        } else if (result[0].output && result[0].output.hazards) {
          console.log('✅ output.hazards에서 데이터 발견')
          parsedData = {
            imageDescription: 'N8N에서 재분석된 이미지의 안전 위험요인을 식별했습니다.',
            hazards: result[0].output.hazards
          }
        }
      } else if (result.analysisData) {
        console.log('✅ result.analysisData에서 데이터 발견')
        parsedData = result.analysisData
      }
      
      if (parsedData && parsedData.imageDescription && parsedData.hazards) {
        Object.assign(analysisData, parsedData)
        console.log('✅ 재분석 완료!')
      } else {
        throw new Error('재분석 결과 데이터 구조가 올바르지 않습니다.')
      }
    } catch (parseError) {
      console.error('❌ 재분석 데이터 파싱 실패:', parseError)
      throw new Error(`재분석 결과를 처리하는 중 오류가 발생했습니다: ${parseError.message}`)
    }
    
  } catch (error) {
    console.error('❌ 다시분석 실패:', error)
    
    let errorMessage = '다시분석 중 오류가 발생했습니다.'
    
    if (error instanceof Error) {
      if (error.message.includes('HTTP error! status: 500')) {
        errorMessage = `서버 내부 오류가 발생했습니다 (500).\n\n가능한 원인:\n1. N8N 워크플로우 설정 문제\n2. 이미지 URL 형식 오류\n3. 서버 처리 중 예외 발생\n\n에러 상세: ${error.message}`
      } else if (error.message.includes('HTTP error! status: 404')) {
        errorMessage = `재분석 엔드포인트를 찾을 수 없습니다 (404).\n\nN8N 워크플로우에서 /webhook/redo 엔드포인트가 올바르게 설정되어 있는지 확인해주세요.`
      } else if (error.message.includes('HTTP error! status: 400')) {
        errorMessage = `잘못된 요청입니다 (400).\n\n요청 데이터 형식을 확인해주세요:\nimgUrl: ${image_Url.value}`
      } else {
        errorMessage = `다시분석 중 오류가 발생했습니다: ${error.message}`
      }
    }
    
    alert(errorMessage)
  } finally {
    isAnalyzing.value = false
    analysisComplete.value = true
  }
}

// 선택 완료 처리
const handleSelectionComplete = (selectedData: any) => {
  console.log('최종 선택된 데이터:', selectedData)
  // TODO: 외부 웹사이트로 데이터 전송
  alert('선택이 완료되었습니다. 외부 시스템으로 전송됩니다.')
}
</script>

<style scoped>
.ai-image-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 120vh;
  background-image: url('/AI분석4.png');
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}

.v-card {
  border-radius: 16px;
  position: relative;
  z-index: 1;
}

.primary--text {
  color: var(--v-primary-base) !important;
}
</style>