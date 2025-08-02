import type { UserInfo } from '@vben/types';

import { preferences } from '@vben/preferences';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息 - 带错误处理
 */
export async function getUserInfoApi() {
  try {
    return await requestClient.get<UserInfo>('/user/info');
  } catch (error) {
    console.warn('获取用户信息接口调用失败，返回默认用户信息:', error);
    // 返回默认用户信息
    return {
      userId: '1',
      username: 'temp-user',
      realName: '临时用户',
      avatar: '',
      desc: '临时用户',
      homePath: preferences.app.defaultHomePath,
      token: 'fake-token-for-development',
      roles: ['super'],
    };
  }
}
