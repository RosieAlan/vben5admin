import { ref } from 'vue';

import OSS from 'ali-oss';

// 导入baseRequestClient
import { baseRequestClient } from '#/api/request';

/**
 * OSS 配置类型
 */
export interface OssConfig {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  stsToken: string;
  bucket: string;
  objectName?: string; // 可选，默认用 file.name
}

/**
 * 上传结果类型
 */
export interface OssUploadResult {
  name: string;
  res: any;
  [key: string]: any;
}

/**
 * 上传错误类型
 */
export interface OssUploadError {
  message: string;
  [key: string]: any;
}

/**
 * OSS Token 响应类型
 */
export interface OssTokenResponse {
  data: {
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    expiration: string;
    region: string;
    securityToken: string;
  };
}

/**
 * 默认OSS上传头信息
 */
const defaultHeaders = {
  // 指定该Object被下载时的网页缓存行为
  'Cache-Control': 'no-cache',
  // 指定该Object被下载时的内容编码格式
  'Content-Encoding': 'utf8',
  // 指定Object的存储类型
  'x-oss-storage-class': 'Standard',
  // 指定初始化分片上传时是否覆盖同名Object
  'x-oss-forbid-overwrite': 'true',
};

/**
 * useOssUpload 组合式函数
 * @param ossConfig OSS 配置
 */
export function useOssUpload(ossConfig: OssConfig) {
  const progress = ref(0); // 上传进度 0~1
  const uploading = ref(false); // 是否正在上传
  const error = ref<null | OssUploadError>(null); // 错误信息
  const result = ref<null | OssUploadResult>(null); // 上传结果

  /**
   * 上传文件到 OSS
   * @param file 要上传的文件
   * @param options 额外 multipartUpload 选项
   * @param customHeaders 自定义请求头
   */
  async function upload(
    file: File,
    options: Record<string, any> = {},
    customHeaders: Record<string, string> = {},
  ): Promise<OssUploadResult> {
    uploading.value = true;
    error.value = null;
    result.value = null;

    try {
      const client = new OSS({
        region: ossConfig.region,
        authorizationV4: true,
        accessKeyId: ossConfig.accessKeyId,
        accessKeySecret: ossConfig.accessKeySecret,
        stsToken: ossConfig.stsToken,
        bucket: ossConfig.bucket,
        // 添加超时配置
        timeout: 300_000, // 5分钟
      });

      const objectName = ossConfig.objectName || file.name;

      // 合并默认头信息和自定义头信息
      const headers = {
        ...defaultHeaders,
        ...customHeaders,
        // 设置Content-Disposition，使用文件名作为下载名称
        'Content-Disposition': `attachment; filename=\${encodeURIComponent(objectName)}`,
        // 设置Content-Type
        'Content-Type': file.type || 'application/octet-stream',
      };

      // 设置分片上传配置
      const uploadOptions = {
        ...options,
        headers,
        progress: (p: number) => {
          progress.value = p;
          if (typeof options.progress === 'function') {
            options.progress(p);
          }
        },
        // 分片大小设置为5MB
        partSize: 5 * 1024 * 1024,
        // 并发数设置为3
        parallel: 3,
        // 上传成功后自动合并分片
        autoCancel: true,
      };

      const res = await client.multipartUpload(objectName, file, uploadOptions);
      result.value = { name: objectName, res };
      return result.value;
    } catch (error_: any) {
      error.value = { message: error_?.message || '上传失败', ...error_ };
      throw error.value;
    } finally {
      uploading.value = false;
    }
  }

  return {
    upload,
    progress,
    uploading,
    error,
    result,
  };
}

// 获取sts消息
export async function getStsTokenApi() {
  try {
    const response =
      await baseRequestClient.get<OssTokenResponse>('/oss/sts-token');
    return response;
  } catch {
    // 返回模拟数据用于开发环境
    return {
      data: {
        accessKeyId: 'STS.NXywD9cA9vVFxqCpcyyuqnUR8',
        accessKeySecret: '5KX9RzpHdX1LZL8NLLPEiQaxhpkDNPEyXQyw91BVua5G',
        securityToken:
          'CAISwQJ1q6Ft5B2yfSjIr5vMPP6Njp4YwZStelfylGMsdfpdgZD52jz2IHhMe3dpCOsdvvk+mmpV6/calqZ5SpBLREjJKNB99Y9W9gX55x5LASPuv9I+k5SANTW5KXyShb3/AYjQSNfaZY3eCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ8PGD6F00kYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gX6wo9y9zmk5PEtEWD1gehlbJK/96vGPX+MZkwZqUYesyuwel7epDG1CNt8BVQ/M909vccoWiZ54DGWAkMskvcbreFqscAJg52aKk+Fr7OBX0laXKt0Qa6tvMUq34lVYk9O0xUVNt3VcEXwZu2LCA/bJj5DQm18fGXbviUwnJUkIJqxvE4iOvTWYyDOW5dCWma87f+mAmaOmzLX1hFKP9eufIagAEqC7S51+vKET7Pw9V9EiZtJFCj62otXruVh9uCZSloVUMY3pjNXiwc7Hwc5unrE6da12LMpnKsdqDwzulsclyKOQpqPqSF+giCptGwZipGDJ70ul3djm95orjaq86+r9BbC1BlidQI9JPQ/KN9gD1MSvErfmIQG3ElED+S7I8sOiAA',
        expiration: '2025-08-05T13:08:13Z',
        bucket: 'big-file28',
        region: 'oss-cn-shenzhen',
      },
    };
  }
}
//
