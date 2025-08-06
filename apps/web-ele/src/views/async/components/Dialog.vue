<template>
  <div style="max-width: 400px; margin: 0 auto; text-align: center;">
    <div class="profile-content">
      <el-image :src="profile?.avatar" alt="avatar" style="width: 120px; border-radius: 50%;" />
      <h2>{{ profile?.name }}</h2>
      <p>年龄：{{ profile?.age }}</p>
      <p>{{ profile?.desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getProfile, type UserProfile } from '#/api/simpleApi';

// 扩展用户信息接口，包含处理后的头像URL
interface ProcessedUserProfile extends UserProfile {
  avatar: string; // 处理后的完整URL
}

// 使用具体类型而不是 any
const profile = ref<ProcessedUserProfile | null>(null);

// 使用 async setup 来配合 Suspense
const loadData = async (): Promise<void> => {
  try {
    // 确保至少显示2秒的骨架屏
    const minLoadingTime = new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // 开始请求数据
    const dataPromise = getProfile();
    
    // 等待数据请求和最小加载时间都完成
    const [data] = await Promise.all([dataPromise, minLoadingTime]);
    
    // 解构赋值并指定类型
    const { age, name, desc, avatar }: UserProfile = data.data;
    
    // 处理头像URL
    const avatarUrl = new URL(avatar, import.meta.url).href;
    
    // 赋值给 profile，类型安全
    profile.value = {
      age,
      name,
      desc,
      avatar: avatarUrl
    };

  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 可以设置默认值或错误状态
    profile.value = null;
  }
};

// 立即执行数据加载
await loadData();
</script>

<style scoped lang="scss">
.profile-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
