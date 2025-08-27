<!--
 * [AI 프롬프트 페이지]
 * AI 프롬프트 작성, 관리, 실행을 위한 종합 페이지
 * 프롬프트 템플릿, 히스토리, 실행 결과 등을 포함
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-01-27 / 정우근 / - / 최초작성
 *     2. 2025-01-27 / 정우근 / - / 최근 실행 기록 제거, 템플릿별 입력 영역 추가
 *     3. 2025-01-27 / 정우근 / - / AI 모델 선택, 창의성 수준, 저장 버튼, 설정 부분 제거
 *     4. 2025-01-27 / 정우근 / - / 입력 필드 레이아웃 변경, 추가정보 제거, 프롬프트 생성하기 버튼 추가, N8N 연동 고려
 *     5. 2025-01-27 / 정우근 / - / 템플릿 선택 시 새로운 예시 표시되도록 수정
 *     6. 2025-01-27 / 정우근 / - / 검은색 배경, 흰색 테두리선 적용
 *     7. 2025-01-27 / 정우근 / - / 템플릿 정리 및 수시위험성평가 템플릿으로 변경
 *     8. 2025-01-27 / 정우근 / - / 프롬프트 생성하기 버튼을 AI 간편 생성으로 변경
 *     9. 2025-01-27 / 정우근 / - / 페이지 헤더 제목 및 설명 제거
 -->

<template>
  <div class="ai-prompt-page">
    <!-- 메인 컨텐츠 영역 -->
    <v-container fluid class="pa-6">
      <v-row>
        <!-- 왼쪽 사이드바 - 프롬프트 템플릿 -->
        <v-col cols="12" md="4" lg="3">
          <v-card class="mb-4 custom-card" elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-format-list-bulleted" class="mr-2" />
              프롬프트 템플릿
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="template in promptTemplates"
                  :key="template.id"
                  :value="template"
                  @click="selectTemplate(template)"
                  class="mb-2"
                  rounded="lg"
                  :class="{ 'bg-primary-lighten-5': selectedTemplate?.id === template.id }"
                >
                  <template #prepend>
                    <v-icon :icon="template.icon" color="primary" />
                  </template>
                  <v-list-item-title>{{ template.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ template.description }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 중앙 - 프롬프트 작성 및 실행 -->
        <v-col cols="12" md="8" lg="9">
          <!-- 템플릿별 입력 영역 -->
          <v-card v-if="selectedTemplate" class="mb-4 custom-card" elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon :icon="selectedTemplate.icon" color="primary" class="mr-2" />
              {{ selectedTemplate.name }} - 상세 정보 입력
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="templateInputs.workType"
                      label="공종"
                      placeholder="예: 건축, 토목, 전기, 기계 등"
                      variant="outlined"
                      class="mb-3"
                      :rules="[v => !!v || '공종을 입력해주세요']"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="templateInputs.weather"
                      label="날씨"
                      placeholder="예: 맑음, 흐림, 비, 눈 등"
                      variant="outlined"
                      class="mb-3"
                      :rules="[v => !!v || '날씨를 입력해주세요']"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="templateInputs.location"
                      label="위치"
                      placeholder="예: 3층 현장, 지하 2층 등"
                      variant="outlined"
                      class="mb-3"
                      :rules="[v => !!v || '위치를 입력해주세요']"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="templateInputs.workerCount"
                      label="작업인원"
                      placeholder="예: 5명, 10명 등"
                      variant="outlined"
                      class="mb-3"
                      :rules="[v => !!v || '작업인원을 입력해주세요']"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="templateInputs.workDuration"
                      label="작업기간"
                      placeholder="예: 3일, 1주일 등"
                      variant="outlined"
                      class="mb-3"
                      :rules="[v => !!v || '작업기간을 입력해주세요']"
                    />
                  </v-col>
                </v-row>
                
                <!-- AI 간편 생성 버튼 -->
                <div class="d-flex justify-center mb-3">
                  <v-btn
                    color="secondary"
                    size="large"
                    @click="generatePromptFromN8N"
                    :loading="isGeneratingPrompt"
                    prepend-icon="mdi-robot"
                    class="px-8"
                  >
                    AI 간편 생성
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <v-card class="mb-4 custom-card" elevation="2">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>프롬프트 작성</span>
              <v-chip color="success" size="small" v-if="isExecuting">
                <v-icon icon="mdi-loading" class="mr-1" />
                실행 중...
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="executePrompt">
                <v-textarea
                  v-model="currentPrompt"
                  label="AI에게 프롬프트 작성해주세요."
                  placeholder="프롬프트를 입력하세요."
                  rows="6"
                  auto-grow
                  variant="outlined"
                  class="mb-2"
                  :disabled="isExecuting"
                />
                
                <!-- 예시 텍스트 -->
                <div class="example-text mb-4">
                  <span class="text-body-2 text-grey-lighten-1">
                    예시 ) 서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 5명이서 8월7일까지 진행합니다.
                  </span>
                </div>

                <div class="d-flex justify-space-between">
                  <v-btn
                    color="blue-darken-4"
                    size="large"
                    @click="executePrompt"
                    :loading="isExecuting"
                    prepend-icon="mdi-send"
                  >
                    프롬프트 실행
                  </v-btn>
                  <v-btn
                    color="red-darken-4"
                    size="large"
                    @click="clearPrompt"
                    prepend-icon="mdi-delete"
                  >
                    지우기
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- 실행 결과 표시 -->
          <v-card v-if="executionResult" class="custom-card" elevation="2">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>실행 결과</span>
              <v-btn
                icon="mdi-content-copy"
                variant="text"
                size="small"
                @click="copyResult"
                title="결과 복사"
              />
            </v-card-title>
            <v-card-text>
              <div class="execution-result">
                <pre class="text-body-1">{{ executionResult }}</pre>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// 페이지 메타데이터 설정
definePageMeta({
  layout: 'ai-prompt'
});

// 반응형 상태 관리
const isExecuting = ref(false);
const isGeneratingPrompt = ref(false);
const currentPrompt = ref(''); // 초기값을 빈 문자열로 설정
const executionResult = ref('');
const selectedTemplate = ref(null);

// 템플릿 입력 데이터
const templateInputs = ref({
  workType: '',
  weather: '',
  location: '',
  workerCount: '',
  workDuration: ''
});

// 프롬프트 템플릿 데이터
const promptTemplates = ref([
  {
    id: 1,
    name: '수시위험성평가 템플릿',
    description: '작업 환경의 수시 위험성 평가를 위한 템플릿',
    icon: 'mdi-clipboard-check',
    template: '서울에서 지하 3층: 방수 및 미장 작업, 지상 7층: 철근콘크리트를 위한 형틀설치, 철근배근, 전선관배관 작업을 타워크레인을 이용해서 5명이서 8월1일부터 8월7일까지 진행합니다'
  }
]);

// 템플릿 선택
function selectTemplate(template: any) {
  selectedTemplate.value = template;
  
  // 템플릿 선택 시 프롬프트 입력 필드 초기화 (예시 텍스트는 별도로 표시되므로 입력 필드는 비움)
  currentPrompt.value = '';
  
  // 템플릿 입력 필드 초기화
  templateInputs.value = {
    workType: '',
    weather: '',
    location: '',
    workerCount: '',
    workDuration: ''
  };
}

// N8N에서 프롬프트 생성
async function generatePromptFromN8N() {
  if (!selectedTemplate.value) {
    const snackbarStore = useSnackbarStore();
    snackbarStore.show('먼저 템플릿을 선택해주세요.', 'warning');
    return;
  }
  
  // 필수 입력값 검증
  const inputs = templateInputs.value;
  if (!inputs.workType || !inputs.weather || !inputs.location || !inputs.workerCount || !inputs.workDuration) {
    const snackbarStore = useSnackbarStore();
    snackbarStore.show('모든 필수 정보를 입력해주세요.', 'warning');
    return;
  }
  
  isGeneratingPrompt.value = true;
  
  try {
    // N8N API 호출을 위한 데이터 준비
    const requestData = {
      template: selectedTemplate.value.name,
      workType: inputs.workType,
      location: inputs.location,
      workerCount: inputs.workerCount,
      workDuration: inputs.workDuration
    };
    
    // N8N 웹훅 URL (실제 환경에서는 환경변수로 관리)
    const n8nWebhookUrl = 'https://your-n8n-instance.com/webhook/generate-prompt';
    
    // N8N API 호출
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`N8N API 호출 실패: ${response.status}`);
    }
    
    const result = await response.json();
    
    // N8N에서 받은 프롬프트로 기존 내용 교체
    if (result.prompt) {
      currentPrompt.value = result.prompt;
      
      const snackbarStore = useSnackbarStore();
      snackbarStore.show('N8N에서 프롬프트를 성공적으로 생성했습니다.', 'success');
    } else {
      throw new Error('N8N에서 유효한 프롬프트를 받지 못했습니다.');
    }
    
  } catch (error) {
    console.error('N8N 프롬프트 생성 오류:', error);
    
    // 에러 발생 시 기본 프롬프트 생성
    const defaultPrompt = generateDefaultPrompt();
    currentPrompt.value = defaultPrompt;
    
    const snackbarStore = useSnackbarStore();
    snackbarStore.show('N8N 연결 실패. 기본 프롬프트를 생성했습니다.', 'info');
  } finally {
    isGeneratingPrompt.value = false;
  }
}

// 기본 프롬프트 생성 (N8N 연결 실패 시)
function generateDefaultPrompt(): string {
  const inputs = templateInputs.value;
  const template = selectedTemplate.value;
  
  if (!template) return '';
  
  let prompt = template.template;
  
  // 공종 정보 추가
  if (inputs.workType) {
    prompt = prompt.replace('[작업명]', inputs.workType);
  }
  
  // 추가 컨텍스트 정보 추가
  const contextInfo = [];
  if (inputs.weather) contextInfo.push(`날씨: ${inputs.weather}`);
  if (inputs.location) contextInfo.push(`작업 위치: ${inputs.location}`);
  if (inputs.workerCount) contextInfo.push(`작업 인원: ${inputs.workerCount}`);
  if (inputs.workDuration) contextInfo.push(`작업 기간: ${inputs.workDuration}`);
  
  if (contextInfo.length > 0) {
    prompt += `\n\n작업 상세 정보:\n${contextInfo.join('\n')}`;
  }
  
  return prompt;
}

// 프롬프트 실행
async function executePrompt() {
  if (!currentPrompt.value.trim()) return;
  
  isExecuting.value = true;
  
  try {
    // 실제 AI API 호출 로직 (현재는 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 템플릿 입력 정보를 포함한 결과 생성
    const enhancedPrompt = enhancePromptWithTemplateInputs(currentPrompt.value);
    executionResult.value = `프롬프트: "${enhancedPrompt}"\n\n결과:\n${generateDummyResult(enhancedPrompt)}`;
    
  } catch (error) {
    console.error('프롬프트 실행 오류:', error);
    executionResult.value = '프롬프트 실행 중 오류가 발생했습니다. 다시 시도해주세요.';
  } finally {
    isExecuting.value = false;
  }
}

// 템플릿 입력 정보를 프롬프트에 통합
function enhancePromptWithTemplateInputs(prompt: string): string {
  if (!selectedTemplate.value || !templateInputs.value.workType) {
    return prompt;
  }
  
  const inputs = templateInputs.value;
  let enhancedPrompt = prompt;
  
  // 공종 정보 추가
  if (inputs.workType) {
    enhancedPrompt = enhancedPrompt.replace('[작업명]', inputs.workType);
  }
  
  // 추가 컨텍스트 정보 추가
  const contextInfo = [];
  if (inputs.weather) contextInfo.push(`날씨: ${inputs.weather}`);
  if (inputs.location) contextInfo.push(`작업 위치: ${inputs.location}`);
  if (inputs.workerCount) contextInfo.push(`작업 인원: ${inputs.workerCount}`);
  if (inputs.workDuration) contextInfo.push(`작업 기간: ${inputs.workDuration}`);
  
  if (contextInfo.length > 0) {
    enhancedPrompt += `\n\n작업 상세 정보:\n${contextInfo.join('\n')}`;
  }
  
  return enhancedPrompt;
}

// 더미 결과 생성
function generateDummyResult(prompt: string): string {
  const responses = [
    '수시위험성평가 결과:\n\n1. 작업 환경 위험 요소 분석\n2. 안전 대책 수립\n3. 작업자 안전 교육 실시\n4. 정기적인 안전 점검 계획',
    '위험성 평가 체크리스트:\n\n- 개인보호구 착용 상태\n- 작업장 환경 안전성\n- 도구 및 장비 상태\n- 응급 대응 계획'
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// 프롬프트 지우기
function clearPrompt() {
  currentPrompt.value = '';
  executionResult.value = '';
  selectedTemplate.value = null;
  
  // 템플릿 입력 필드도 초기화
  templateInputs.value = {
    workType: '',
    weather: '',
    location: '',
    workerCount: '',
    workDuration: ''
  };
}

// 결과 복사
function copyResult() {
  if (executionResult.value) {
    navigator.clipboard.writeText(executionResult.value);
    
    const snackbarStore = useSnackbarStore();
    snackbarStore.show('결과가 클립보드에 복사되었습니다.', 'success');
  }
}
</script>

<style scoped>
.ai-prompt-page {
  min-height: 100vh;
  background-color: #000000;
  color: white;
}

.custom-card {
  border: 1px solid #ffffff !important;
  background-color: #1a1a1a !important;
}

.execution-result {
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid var(--v-primary-base);
  border: 1px solid #ffffff;
}

.execution-result pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: 'Courier New', monospace;
  line-height: 1.5;
  color: white;
}

.example-text {
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--v-primary-base);
}

.v-list-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background-color: var(--v-primary-lighten-5);
}

.v-list-item.bg-primary-lighten-5 {
  background-color: var(--v-primary-lighten-5) !important;
}

/* 반응형 디자인 */
@media (max-width: 960px) {
  .ai-prompt-page .v-col {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .ai-prompt-page .v-container {
    padding: 16px;
  }
}
</style>
