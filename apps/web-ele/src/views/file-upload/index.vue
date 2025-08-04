<template>
  <div class="file-upload-page">
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">大文件上传测试</h1>
      <div class="bg-white rounded-lg shadow-md p-6">
        <input
          type="file"
          class="file-input"
          @change="handleFileChange"
          accept=".*"
        />
        <div v-if="file" class="mt-4 p-4 border rounded">
          <p class="font-medium">选中文件: {{ file.name }}</p>
          <p class="text-sm text-gray-500">大小: {{ formatFileSize(file.size) }}</p>
          <button
            @click="uploadFile"
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            上传文件
          </button>
        </div>
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-500 h-2.5 rounded-full"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-sm mt-2">上传进度: {{ uploadProgress }}%</p>
        </div>
        <div v-if="uploadStatus === 'success'" class="mt-4 text-green-600">
          文件上传成功!
        </div>
        <div v-if="uploadStatus === 'error'" class="mt-4 text-red-600">
          文件上传失败，请重试。
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const file = ref<File | null>(null);
const uploadProgress = ref(0);
const uploadStatus = ref<'idle' | 'uploading' | 'success' | 'error'>('idle');

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0] as File;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const uploadFile = () => {
  if (!file.value) return;

  uploadStatus.value = 'uploading';
  uploadProgress.value = 0;

  // 模拟上传进度
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 10;
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100;
      uploadStatus.value = 'success';
      clearInterval(interval);
    }
  }, 500);
};
</script>

<style scoped>
.file-upload-page {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.file-input {
  width: 100%;
  padding: 20px;
  cursor: pointer;
  border: 2px dashed #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.file-input:hover {
  border-color: #4096ff;
}
</style>
