import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:map',
      keepAlive: false,
      order: 1000,
      title: $t('可视化大屏	'),
      ignoreAccess: true,
    },
    name: 'Map',
    path: '/map',
    component: () => import('#/views/map/index.vue'),
  },
];

export default routes;
