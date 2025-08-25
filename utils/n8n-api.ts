/**
 * N8N API 통신 유틸리티
 * AI 이미지 분석을 위한 Webhook 연동
 */

// N8N Webhook URL
const N8N_WEBHOOK_URL = 'https://ai-chatbot.myconst.com/webhook-test/image'

// 이미지 분석 요청 인터페이스
export interface ImageAnalysisRequest {
  image: File
  timestamp: string
  requestId: string
}

// 이미지 분석 응답 인터페이스
export interface ImageAnalysisResponse {
  success: boolean
  requestId: string
  analysisData?: {
    imageDescription: string
    hazards: Array<{
      id: number
      name: string
      description: string
      safetyMeasures: Array<{
        id: number
        name: string
        description: string
      }>
    }>
  }
  error?: string
  processingTime?: number
}

/**
 * 네트워크 연결 상태 확인
 * 
 * @returns Promise<boolean> 인터넷 연결 상태
 */
export async function checkInternetConnection(): Promise<boolean> {
  try {
    // 간단한 인터넷 연결 테스트
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch (error) {
    console.error('인터넷 연결 확인 실패:', error)
    return false
  }
}

/**
 * N8N Webhook 연결 테스트
 * 
 * @returns Promise<boolean> 연결 성공 여부
 */
export async function testN8NConnection(): Promise<boolean> {
  try {
    console.log('🔍 N8N Webhook 연결 테스트 시작')
    
    // CORS 정책 우회를 위한 다양한 모드 테스트
    const testModes = [
      { mode: 'cors', description: 'CORS 모드' },
      { mode: 'no-cors', description: 'No-CORS 모드' },
      { mode: 'same-origin', description: 'Same-Origin 모드' }
    ]
    
    for (const testMode of testModes) {
      try {
        console.log(`🔄 ${testMode.description}로 테스트 중...`)
        
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'GET',
          mode: testMode.mode as RequestMode,
          signal: AbortSignal.timeout(10000)
        })
        
        console.log(`✅ ${testMode.description} 성공:`, response.status, response.statusText)
        return true
        
      } catch (modeError) {
        console.warn(`⚠️ ${testMode.description} 실패:`, modeError)
      }
    }
    
    // 모든 모드 실패 시
    console.error('❌ 모든 CORS 모드에서 연결 실패')
    console.error('🔍 문제 해결 방법:')
    console.error('1. N8N 서버가 실행 중인지 확인')
    console.error('2. Webhook URL이 올바른지 확인')
    console.error('3. 방화벽/프록시 설정 확인')
    console.error('4. CORS 정책 설정 확인')
    return false
    
  } catch (error) {
    console.error('❌ N8N Webhook 연결 테스트 중 오류:', error)
    return false
  }
}

/**
 * 이미지를 N8N Webhook으로 전송하여 AI 분석 요청
 * 
 * @param imageFile 업로드된 이미지 파일
 * @returns Promise<ImageAnalysisResponse> AI 분석 결과
 */
export async function requestImageAnalysis(imageFile: File): Promise<ImageAnalysisResponse> {
  try {
    // 1. Webhook URL 접근성 테스트
    console.log('🔍 N8N Webhook URL 테스트 시작')
    console.log('URL:', N8N_WEBHOOK_URL)
    
    // 2. 간단한 GET 요청으로 URL 접근성 확인
    try {
      const testResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'GET',
        mode: 'cors',
        signal: AbortSignal.timeout(10000) // 10초 타임아웃
      })
      console.log('✅ GET 요청 성공:', testResponse.status, testResponse.statusText)
    } catch (testError) {
      console.warn('⚠️ GET 요청 실패 (POST 요청은 계속 진행):', testError)
    }

    // 3. FormData 생성
    const formData = new FormData()
    formData.append('data', imageFile)
    formData.append('timestamp', new Date().toISOString())
    formData.append('requestId', generateRequestId())

    // 4. N8N Webhook으로 POST 요청
    console.log('🚀 N8N Webhook으로 이미지 전송 시작:', {
      url: N8N_WEBHOOK_URL,
      imageSize: imageFile.size,
      imageType: imageFile.type,
      timestamp: new Date().toISOString()
    })

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      mode: 'cors', // CORS 모드 명시적 설정
      credentials: 'omit', // 쿠키 전송 안함
      // 타임아웃 설정 (10분 - AI 분석에 충분한 시간)
      signal: AbortSignal.timeout(10 * 60 * 1000)
    })

    console.log('N8N Webhook 응답 상태:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    }

    const result: ImageAnalysisResponse = await response.json()
    console.log('N8N Webhook 응답 데이터:', result)
    
    return result

  } catch (error) {
    console.error('❌ 이미지 분석 요청 실패:', error)
    
    let errorMessage = '알 수 없는 오류가 발생했습니다.'
    let errorType = 'Unknown'
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorType = error.name
    } else if (typeof error === 'string') {
      errorMessage = error
      errorType = 'String'
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message)
      errorType = 'Object'
    }
    
    // CORS 에러 특별 처리
    if (errorMessage.includes('CORS') || errorMessage.includes('cors')) {
      errorMessage = 'CORS 정책 위반: N8N 서버에서 이 도메인을 허용하지 않습니다.'
    }
    
    // 네트워크 에러 특별 처리
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      errorMessage = '네트워크 연결 실패: N8N 서버에 연결할 수 없습니다.'
    }
    
    console.error('에러 상세 정보:', {
      type: errorType,
      message: errorMessage,
      originalError: error
    })
    
    // 에러 응답 반환
    return {
      success: false,
      requestId: generateRequestId(),
      error: errorMessage
    }
  }
}

/**
 * 고유한 요청 ID 생성
 * 
 * @returns string 고유한 요청 ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 파일 크기 유효성 검사 (10MB 제한)
 * 
 * @param file 검사할 파일
 * @returns boolean 유효성 여부
 */
export function validateFileSize(file: File): boolean {
  const maxSize = 10 * 1024 * 1024 // 10MB
  return file.size <= maxSize
}

/**
 * 이미지 파일 형식 유효성 검사
 * 
 * @param file 검사할 파일
 * @returns boolean 유효성 여부
 */
export function validateImageFormat(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}
