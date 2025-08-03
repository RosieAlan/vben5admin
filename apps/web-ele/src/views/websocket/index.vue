<!-- /views/demo/WebSocketPage.vue -->
<template>
  <div>
    <el-button @click="dialogVisible = true">打开轨迹弹窗</el-button>
    <WebSocketDialog v-model:visible="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WebSocketDialog from './components/WebSocketDialog.vue';

const dialogVisible = ref(false);
</script>
