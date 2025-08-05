<script setup lang="ts">
import { getStsTokenApi } from '#/api/upload';

const testSts = async () => {
  try {
    const res = await getStsTokenApi();
    // STS Token: res
  } catch {
    // Failed to fetch STS token: error
  }
};
</script>

<template>
  <div>
    <el-button @click="testSts">111</el-button>
  </div>
</template>

<style scoped lang="scss"></style>
