import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:home',
      keepAlive: false,
      order: 1,
      title: $t('首页'),
    },
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('#/views/dashboard/analytics/index.vue'),
  },
];

export default routes;
