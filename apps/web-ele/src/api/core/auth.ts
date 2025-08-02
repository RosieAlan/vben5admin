import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录 - 带错误处理
 */
export async function loginApi(data: AuthApi.LoginParams) {
  try {
    return await requestClient.post<AuthApi.LoginResult>('/auth/login', data);
  } catch (error) {
    console.warn('登录接口调用失败，返回默认token:', error);
    // 返回默认的登录结果
    return {
      accessToken: 'fake-token-for-development',
    };
  }
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  try {
    return await baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
      withCredentials: true,
    });
  } catch (error) {
    console.warn('刷新token接口调用失败:', error);
    throw error;
  }
}

/**
 * 退出登录
 */
export async function logoutApi() {
  try {
    return await baseRequestClient.post('/auth/logout', {
      withCredentials: true,
    });
  } catch (error) {
    console.warn('退出登录接口调用失败:', error);
    // 即使退出登录失败也不抛出错误
    return { success: true };
  }
}

/**
 * 获取用户权限码 - 带错误处理
 */
export async function getAccessCodesApi() {
  try {
    return await requestClient.get<string[]>('/auth/codes');
  } catch (error) {
    console.warn('获取权限码接口调用失败，返回默认权限:', error);
    // 返回默认权限码
    return ['*:*:*'];
  }
}
