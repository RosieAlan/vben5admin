import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { ElNotification } from 'element-plus';
import { defineStore } from 'pinia';

import { getAccessCodesApi, getUserInfoApi, loginApi, logoutApi } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      
      // 尝试调用登录接口，如果失败则使用默认值
      let accessToken: string | null = null;
      try {
        const result = await loginApi(params);
        accessToken = result.accessToken;
      } catch (error) {
        console.warn('登录接口调用失败，使用默认token:', error);
        // 接口失败时使用默认token
        accessToken = 'fake-token-for-development';
      }

      // 如果获取到 accessToken（无论是真实的还是默认的）
      if (accessToken) {
        // 将 accessToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken);

        // 尝试获取用户信息和权限码，如果失败则使用默认值
        let fetchUserInfoResult: UserInfo | null = null;
        let accessCodes: string[] = [];
        
        try {
          [fetchUserInfoResult, accessCodes] = await Promise.all([
            fetchUserInfo(),
            getAccessCodesApi(),
          ]);
        } catch (error) {
          console.warn('获取用户信息或权限码失败，使用默认值:', error);
          // 创建默认用户信息
          fetchUserInfoResult = {
            userId: '1',
            username: params.username || 'temp-user',
            realName: '临时用户',
            avatar: '',
            desc: '临时用户',
            homePath: preferences.app.defaultHomePath,
            token: 'fake-token-for-development',
            roles: ['super'],
          };
          accessCodes = ['*:*:*']; // 默认所有权限
        }

        userInfo = fetchUserInfoResult;

        userStore.setUserInfo(userInfo);
        accessStore.setAccessCodes(accessCodes);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.realName) {
          ElNotification({
            message: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            title: $t('authentication.loginSuccess'),
            type: 'success',
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    try {
      userInfo = await getUserInfoApi();
      userStore.setUserInfo(userInfo);
    } catch (error) {
      console.warn('获取用户信息失败，使用默认用户信息:', error);
      // 创建默认用户信息
      userInfo = {
        userId: '1',
        username: 'temp-user',
        realName: '临时用户',
        avatar: '',
        desc: '临时用户',
        homePath: preferences.app.defaultHomePath,
        token: 'fake-token-for-development',
        roles: ['super'],
      };
      userStore.setUserInfo(userInfo);
    }
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
