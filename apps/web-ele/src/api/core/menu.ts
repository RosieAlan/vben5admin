import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单 - 带错误处理
 */
export async function getAllMenusApi() {
  try {
    return await requestClient.get<RouteRecordStringComponent[]>('/menu/all');
  } catch (error) {
    console.warn('获取菜单接口调用失败，返回默认菜单:', error);
    // 返回默认菜单，包含一些基本的路由
    return [
      {
        component: 'LAYOUT',
        meta: {
          icon: 'lucide:home',
          title: '首页',
          order: 1,
        },
        name: 'Dashboard',
        path: '/dashboard',
        children: [
          {
            component: 'views/dashboard/index.vue',
            meta: {
              title: '仪表盘',
            },
            name: 'DashboardIndex',
            path: 'index',
          },
        ],
      },
      {
        component: 'LAYOUT',
        meta: {
          icon: 'lucide:file-text',
          title: '大文件上传',
          order: 1000,
        },
        name: 'BigFile',
        path: '/bigFile',
        children: [
          {
            component: 'views/bigFile/index.vue',
            meta: {
              title: '大文件上传',
            },
            name: 'BigFileIndex',
            path: 'index',
          },
        ],
      },
    ];
  }
}
