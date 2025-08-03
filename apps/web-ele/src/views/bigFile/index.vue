<template>
  <div >
    <el-button @click="testSts">testSts</el-button>
  </div>
</template>

<script setup lang="ts">
import { getStsTokenApi } from '#/api/upload';
const testSts = async () => {
  try {
    const res = await getStsTokenApi();
    console.log('STS Token:', res);
  } catch (error) {
    console.error('Failed to fetch STS token:', error);
  }
}
</script>

<style scoped lang="scss"></style>
