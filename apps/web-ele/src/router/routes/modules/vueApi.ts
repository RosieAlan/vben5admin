import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:home',
      keepAlive: true,
      order: 1,
      title: $t('VueApi'),
    },
    name: 'VueApi',
    path: '/vueApi',
    children: [
      {
        meta: {
          title: '父子组件传参',
          description: '学习父子组件之间的数据传递，包括props和emit的使用',
          icon: '👨‍👩‍👧‍👦',
        },
        name: 'FatherSon',
        path: 'father-son',
        component: () => import('#/views/vueApi/father-son/index.vue'),
      },
      {
        meta: {
          title: 'Provide-Inject',
          description: '学习跨层级组件通信，provide和inject的使用场景',
          icon: '🔗',
        },
        name: 'ProvideInject',
        path: 'provide-inject',
        component: () => import('#/views/vueApi/provide-inject/index.vue'),
      },
    ],
  },
];

export default routes;
