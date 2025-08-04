import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:upload',
      title: '大文件上传测试',
    },
    name: 'FileUpload',
    path: '/file-upload',
    component: () => import('#/views/file-upload/index.vue'),
  },
];

export default routes;