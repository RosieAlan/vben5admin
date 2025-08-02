import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:file-text',
      keepAlive: false,
      order: 1000,
      title: $t('大文件上传'),
      ignoreAccess: true,
    },
    name: 'BigFile',
    path: '/bigFile',
    component: () => import('#/views/bigFile/index.vue'),
  },
];

export default routes;
