import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:file-text',
      keepAlive: false,
      order: 1000,
      title: $t('测试websocket'),
      ignoreAccess: true,
    },
    name: 'WebSocket',
    path: '/websocket',
    component: () => import('#/views/websocket/index.vue'),
  },
];

export default routes;
