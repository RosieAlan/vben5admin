import { baseRequestClient, requestClient } from '#/api/request';


//获取sts消息
export async function getStsTokenApi() {
  try {
    return await baseRequestClient.get('/oss/sts-token');
  } catch (error) {
    console.warn('登录接口调用失败，返回默认token:', error);
    // 返回默认的登录结果
    return {
      accessToken: 'fake-token-for-development',
    };
  }
}
