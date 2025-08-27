# 🚀 AI 이미지 안전 분석 시스템 개발 계획서

## 📋 프로젝트 개요
사용자가 업로드한 이미지를 AI가 분석하여 작업 현장의 유해위험요인과 안전대책을 제공하는 시스템

## 🎯 주요 기능
1. **이미지 업로드**: 드래그 앤 드롭 또는 클릭으로 이미지 업로드
2. **AI 분석 진행 UI**: 7초간 스캔 애니메이션과 진행률 표시
3. **결과 표시**: 유해위험요인 3개 + 각각 1~3개의 안전대책
4. **사용자 선택**: 위험요인별 안전대책 선택
5. **최종 제출**: 선택된 결과를 외부 시스템으로 전송

## 🏗️ 구현된 컴포넌트

### ✅ 완료된 컴포넌트
1. **`pages/ai-image.vue`** - 메인 페이지
   - 전체 워크플로우 관리
   - 상태 관리 (업로드 → 분석 → 결과 → 선택)
   - 더미 데이터 포함

2. **`components/ai-image/ImageUploader.vue`** - 이미지 업로더
   - 드래그 앤 드롭 지원
   - 파일 유효성 검사 (이미지 형식, 10MB 제한)
   - 이미지 미리보기

3. **`components/ai-image/AnalysisProgress.vue`** - AI 분석 진행 UI
   - 스캔 애니메이션 (그리드 라인, 스캔 라인)
   - 7초 진행률 애니메이션
   - 단계별 진행 상태 표시
   - AI 로봇 애니메이션

4. **`components/ai-image/AnalysisResult.vue`** - 분석 결과 표시
   - 유해위험요인 3개 표시
   - 각 위험요인별 안전대책 표시
   - 사용자 선택 기능
   - 선택 요약 표시

5. **`components/ai-image/SafetySelection.vue`** - 최종 선택 및 제출
   - 선택된 항목 요약
   - 통계 정보 (위험요인 수, 안전대책 수, 커버리지)
   - 추가 정보 입력 (작업장소, 작업유형, 메모)
   - 최종 제출 기능

### 🆕 새로 추가된 컴포넌트 (2025-01-27)
6. **`layouts/ai-prompt.vue`** - AI 프롬프트 전용 레이아웃
   - AI 프롬프트 작업에 최적화된 헤더
   - AI 로봇 아이콘과 브랜딩
   - 깔끔한 그라데이션 배경

7. **`pages/ai-prompt.vue`** - AI 프롬프트 관리 페이지
   - 프롬프트 템플릿 (안전 체크리스트, 작업 절차서, 위험 요소 분석, 교육 자료)
   - 프롬프트 작성 및 실행 기능
   - AI 모델 선택 및 창의성 수준 조정
   - 실행 결과 표시 및 복사 기능
   - 최근 실행 기록 관리
   - 자동 저장 및 설정 기능
   - 프롬프트 작성 팁 제공

## 🔄 워크플로우
```
1. 이미지 업로드 → 2. AI 분석 진행 (7초) → 3. 결과 표시 → 4. 사용자 선택 → 5. 최종 제출
```

## 🆕 AI 프롬프트 워크플로우 (2025-01-27)
```
1. 템플릿 선택 → 2. 프롬프트 작성/수정 → 3. AI 모델 및 설정 선택 → 4. 프롬프트 실행 → 5. 결과 확인 및 복사
```

## 📊 데이터 구조
```typescript
interface AnalysisData {
  imageDescription: string
  hazards: Hazard[]
}

interface Hazard {
  id: number
  name: string
  description: string
  safetyMeasures: SafetyMeasure[]
}

interface SafetyMeasure {
  id: number
  name: string
  description: string
}
```

## 🆕 AI 프롬프트 데이터 구조 (2025-01-27)
```typescript
interface PromptTemplate {
  id: number
  name: string
  description: string
  icon: string
  template: string
}

interface ExecutionHistory {
  id: number
  prompt: string
  timestamp: Date
  result: string
}

interface WritingTip {
  id: number
  title: string
  description: string
}
```

## 🎨 UI/UX 특징
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **Vuetify 컴포넌트**: Material Design 기반 일관된 UI
- **애니메이션**: 스캔 효과, 진행률, 단계별 표시
- **사용자 경험**: 직관적인 단계별 진행과 선택

## 🆕 AI 프롬프트 UI/UX 특징 (2025-01-27)
- **3단 레이아웃**: 템플릿/히스토리, 작성/실행, 설정/도움말
- **프롬프트 템플릿**: 안전 관련 4가지 템플릿 제공
- **실시간 피드백**: 실행 상태, 결과 표시, 히스토리 관리
- **사용자 설정**: 자동 저장, 다크 모드, 프롬프트 제안

## 🚧 다음 단계 (향후 개발)
1. **N8N 연동**: 실제 AI 분석 API 연동
2. **외부 시스템 연동**: 선택된 결과를 외부 웹사이트로 전송
3. **데이터 저장**: 분석 결과 및 사용자 선택 데이터 저장
4. **사용자 인증**: 로그인 및 권한 관리
5. **히스토리**: 이전 분석 결과 조회

## 🆕 AI 프롬프트 향후 개발 계획 (2025-01-27)
6. **실제 AI API 연동**: OpenAI, Claude 등 실제 AI 서비스 연동
7. **프롬프트 라이브러리**: 사용자 정의 프롬프트 저장 및 공유
8. **실행 결과 분석**: 프롬프트 품질 및 효과 분석
9. **협업 기능**: 팀원 간 프롬프트 공유 및 협업

## 🧪 테스트 방법
1. `pages/ai-image.vue` 페이지 접속
2. 이미지 파일 업로드 (JPG, PNG, GIF)
3. AI 분석 진행 UI 확인 (7초)
4. 결과 표시 및 안전대책 선택
5. 최종 제출 및 데이터 확인

## 🆕 AI 프롬프트 테스트 방법 (2025-01-27)
6. `pages/ai-prompt.vue` 페이지 접속
7. 프롬프트 템플릿 선택 및 수정
8. AI 모델 및 설정 선택
9. 프롬프트 실행 및 결과 확인
10. 결과 복사 및 히스토리 확인

## 📁 파일 구조
```
pages/
  ├── ai-image.vue
  └── ai-prompt.vue
layouts/
  ├── ai-image.vue
  ├── ai-prompt.vue
  └── default.vue
components/
  └── ai-image/
      ├── ImageUploader.vue
      ├── AnalysisProgress.vue
      ├── AnalysisResult.vue
      └── SafetySelection.vue
```

## 🎯 현재 상태
**✅ 1단계 완료**: 기본 페이지 및 모든 컴포넌트 구현 완료
**✅ 2단계 완료**: AI 프롬프트 레이아웃 및 페이지 추가 완료
**🔄 3단계 진행 중**: 테스트 및 디버깅
**⏳ 4단계 대기**: N8N 연동 및 외부 시스템 연동

---
*마지막 업데이트: 2025-01-27*
*개발자: AI Assistant*