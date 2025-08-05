<script setup lang="ts">
import { computed, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getStsTokenApi, useOssUpload } from '#/api/upload';

import 'element-plus/es/components/message/style/css';

// 文件引用
const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const previewUrl = ref('');
const uploadProgress = ref(0);
const isUploading = ref(false);

// OSS配置类型定义
interface OssTokenResponse {
  data: {
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    expiration: string;
    region: string;
    securityToken: string;
  };
}

// OSS配置
const ossConfig = ref({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  stsToken: '',
  bucket: '',
});

// 上传配置
const maxSize = 5 * 1024 * 1024; // 5MB
const allowedTypes = new Set([
  'application/msword',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/gif',
  'image/jpeg',
  'image/png',
]);

// 上传工具引用
let uploadTool: null | ReturnType<typeof useOssUpload> = null;

// 处理文件选择
function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const selectedFile = target.files[0];

    // 检查文件类型
    if (!allowedTypes.has(selectedFile.type)) {
      ElMessage.error('不支持的文件类型，请上传图片、PDF或Word文档');
      return;
    }

    // 检查文件大小
    if (selectedFile.size > maxSize) {
      ElMessage.error('文件大小不能超过5MB');
      return;
    }

    file.value = selectedFile;

    // 如果是图片，生成预览
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        previewUrl.value = e.target?.result as string;
      });
      reader.readAsDataURL(selectedFile);
    } else {
      previewUrl.value = '';
    }
  }
}

// 初始化上传工具
function initUploadTool(config: any) {
  uploadTool = useOssUpload(config);

  // 监听进度变化
  if (uploadTool) {
    uploadTool.progress.value = 0;
    // 这里使用计算属性监听进度变化
    const progressWatcher = computed(() => uploadTool!.progress.value);
    uploadProgress.value = progressWatcher.value * 100;
  }
}

// 处理上传
async function handleUpload() {
  if (!file.value) {
    ElMessage.warning('请先选择文件');
    return;
  }

  try {
    isUploading.value = true;
    uploadProgress.value = 0;

    // 获取OSS令牌
    const tokenResponse = (await getStsTokenApi()) as OssTokenResponse;

    // 更新OSS配置
    ossConfig.value = {
      region: tokenResponse.data.region,
      accessKeyId: tokenResponse.data.accessKeyId,
      accessKeySecret: tokenResponse.data.accessKeySecret,
      stsToken: tokenResponse.data.securityToken,
      bucket: tokenResponse.data.bucket,
    };

    // 初始化上传工具
    initUploadTool(ossConfig.value);

    if (!uploadTool) {
      throw new Error('上传工具初始化失败');
    }

    // 设置上传选项
    const uploadOptions = {
      progress: (p: number) => {
        uploadProgress.value = p * 100;
      },
      // 添加元数据
      meta: {
        'Content-Type': file.value.type,
      },
    };

    // 执行上传
    const result = await uploadTool.upload(file.value, uploadOptions);

    ElMessage.success('上传成功');
    // 重置文件选择
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    file.value = null;
    previewUrl.value = '';
  } catch (error: any) {
    ElMessage.error(`上传失败: ${error.message || '未知错误'}`);
  } finally {
    isUploading.value = false;
  }
}

// 取消上传
function cancelUpload() {
  // 重置文件选择
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  file.value = null;
  previewUrl.value = '';
  uploadProgress.value = 0;
}
</script>

<template>
  <div
    class="file-upload-container mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md"
  >
    <h2 class="mb-6 text-xl font-bold text-gray-800">文件上传</h2>

    <div class="mb-6">
      <label
        for="fileInput"
        class="mb-2 block text-sm font-medium text-gray-700"
        >选择文件</label
      >
      <div class="flex items-center gap-4">
        <input
          type="file"
          id="fileInput"
          ref="fileInput"
          @change="handleFileChange"
          class="hidden"
        />
        <button
          type="button"
          @click="fileInput?.click()"
          class="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-600 transition hover:bg-blue-100"
        >
          浏览文件
        </button>
        <span class="text-sm text-gray-500" v-if="file">{{ file.name }}</span>
        <button
          v-if="file"
          @click="cancelUpload"
          class="text-red-500 hover:text-red-700"
        >
          取消选择
        </button>
      </div>
      <p class="mt-2 text-xs text-gray-500">
        支持格式: JPG, PNG, GIF, PDF, Word (最大5MB)
      </p>
    </div>

    <!-- 图片预览 -->
    <div v-if="previewUrl" class="mb-6">
      <h3 class="mb-2 text-sm font-medium text-gray-700">预览</h3>
      <img
        :src="previewUrl"
        alt="预览图"
        class="h-auto max-h-64 max-w-full rounded-md border border-gray-200"
      />
    </div>

    <!-- 上传按钮 -->
    <div class="mb-6 flex items-center gap-4">
      <el-button
        @click="handleUpload"
        :disabled="isUploading || !file"
        type="primary"
        :loading="isUploading"
        class="px-6 py-2"
      >
        上传
      </el-button>
      <div v-if="uploadProgress" class="flex-1">
        <div class="h-2.5 w-full rounded-full bg-gray-200">
          <div
            class="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
            :style="{ width: `${uploadProgress * 100}%` }"
          ></div>
        </div>
        <p class="mt-1 text-right text-xs text-gray-500">
          {{ (uploadProgress * 100).toFixed(2) }}%
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-upload-container {
  margin-top: 2rem;
}
</style>
