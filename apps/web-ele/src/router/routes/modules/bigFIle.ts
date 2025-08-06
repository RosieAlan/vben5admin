import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:package-plus',
      keepAlive: false,
      order: 1000,
      title: $t('异步组件&代码分包&suspense'),
      ignoreAccess: true,
    },
    name: 'async',
    path: '/async',
    component: () => import('#/views/async/index.vue'),
  },
];

export default routes;
