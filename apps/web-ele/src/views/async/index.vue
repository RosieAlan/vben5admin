<template>
  <div class="async-page">
    <Suspense>
      <template #default>
        <Dialog />
      </template>
      <template #fallback>
        <div class="skeleton-container">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-name"></div>
          <div class="skeleton-age"></div>
          <div class="skeleton-desc"></div>
        </div>
      </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// 异步加载 Dialog 组件
const Dialog = defineAsyncComponent(() => import('./components/Dialog.vue'));
</script>
<style scoped lang="scss">


@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skeleton-container {
    padding: 30px 20px;
    margin: 20px;
  }

  .skeleton-desc {
    width: 240px;
  }
}

.async-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.skeleton-container {
  max-width: 400px;
  padding: 40px;
  text-align: center;
  background: rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 10%);
  backdrop-filter: blur(10px);
}

.skeleton-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  background: linear-gradient(90deg, rgb(255 255 255 / 10%) 25%, rgb(255 255 255 / 20%) 50%, rgb(255 255 255 / 10%) 75%);
  background-size: 200% 100%;
  border: 2px solid rgb(255 255 255 / 30%);
  border-radius: 50%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-name {
  width: 150px;
  height: 32px;
  margin: 0 auto 20px;
  background: linear-gradient(90deg, rgb(255 255 255 / 10%) 25%, rgb(255 255 255 / 20%) 50%, rgb(255 255 255 / 10%) 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-age {
  width: 100px;
  height: 20px;
  margin: 0 auto 16px;
  background: linear-gradient(90deg, rgb(255 255 255 / 10%) 25%, rgb(255 255 255 / 20%) 50%, rgb(255 255 255 / 10%) 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-desc {
  width: 280px;
  height: 20px;
  margin: 0 auto;
  background: linear-gradient(90deg, rgb(255 255 255 / 10%) 25%, rgb(255 255 255 / 20%) 50%, rgb(255 255 255 / 10%) 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: skeleton-loading 1.5s infinite;
}
</style>
