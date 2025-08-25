<!--
 * 이미지 업로더 컴포넌트
 * 사용자가 이미지를 드래그 앤 드롭하거나 클릭하여 업로드할 수 있음
 -->
<template>
  <div class="image-uploader">
    <!-- 업로드 영역 -->
    <v-card
      class="upload-area text-center pa-8"
      :class="{ 'upload-area--dragover': isDragOver }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @click="triggerFileInput"
    >
      <v-icon size="64" class="mb-4" color="primary">
        mdi-cloud-upload
      </v-icon>
      
      <h3 class="text-h5 mb-2">이미지를 업로드하세요</h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        드래그 앤 드롭하거나 클릭하여 이미지를 선택하세요
      </p>
      
      <v-btn
        color="primary"
        size="large"
        variant="outlined"
        @click.stop="triggerFileInput"
      >
        이미지 선택
      </v-btn>
      
      <p class="text-caption text-medium-emphasis mt-4">
        지원 형식: JPG, PNG, GIF (최대 10MB)
      </p>
    </v-card>

    <!-- 숨겨진 파일 입력 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="d-none"
      @change="handleFileSelect"
    />

    <!-- 업로드된 이미지 미리보기 -->
    <div v-if="uploadedImage" class="mt-6">
      <v-card class="pa-4">
        <div class="d-flex align-center">
          <v-avatar size="60" class="mr-4">
            <v-img :src="imagePreview" alt="업로드된 이미지" />
          </v-avatar>
          <div class="flex-grow-1">
            <h4 class="text-h6 mb-1">{{ uploadedImage.name }}</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ formatFileSize(uploadedImage.size) }}
            </p>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="error"
            @click="removeImage"
          />
        </div>
        
        <v-btn
          color="primary"
          size="large"
          class="mt-4"
          block
          @click="startAnalysis"
        >
          AI 분석 시작
        </v-btn>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { validateFileSize, validateImageFormat } from '../../utils/n8n-api'

// Props & Emits
const emit = defineEmits<{
  'image-uploaded': [file: File]
}>()

// 상태 관리
const isDragOver = ref(false)
const uploadedImage = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

// 이미지 미리보기 URL
const imagePreview = computed(() => {
  if (!uploadedImage.value) return ''
  return URL.createObjectURL(uploadedImage.value)
})

// 파일 입력 트리거
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 파일 선택 처리
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file && isValidImageFile(file)) {
    uploadedImage.value = file
  }
}

// 드래그 앤 드롭 처리
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  
  if (files && files.length > 0) {
    const file = files[0]
    if (isValidImageFile(file)) {
      uploadedImage.value = file
    }
  }
}

// 이미지 파일 유효성 검사
const isValidImageFile = (file: File): boolean => {
  if (!validateImageFormat(file)) {
    alert('지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WebP 파일만 업로드 가능합니다.')
    return false
  }
  
  if (!validateFileSize(file)) {
    alert('파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.')
    return false
  }
  
  return true
}

// 파일 크기 포맷팅
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 이미지 제거
const removeImage = () => {
  uploadedImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// AI 분석 시작
const startAnalysis = () => {
  if (uploadedImage.value) {
    emit('image-uploaded', uploadedImage.value)
  }
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-area {
  border: 2px dashed var(--v-border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--v-surface-variant);
}

.upload-area:hover {
  border-color: var(--v-primary-base);
  background: var(--v-primary-lighten5);
}

.upload-area--dragover {
  border-color: var(--v-primary-base);
  background: var(--v-primary-lighten5);
  transform: scale(1.02);
}

.upload-area:hover .v-icon {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
</style>