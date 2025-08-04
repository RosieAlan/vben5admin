<template>
  <v-scale-screen>
    <div class="box">
      <video style="width: 100%; height: 100%" muted loop autoplay>
        <source src="../../../src/assets/dv-index-main.mp4" />
      </video>
      <div class="dv-index-main">
        <div class="dv-btn-group">
          <div
            v-for="(item, index) in btnArr"
            :key="index"
            class="btn-item"
            :class="[btnClassHandle(item.num)]"
          >
            <img :src="getImageUrl(item.url)" alt="" />
          </div>
        </div>
      </div>
    </div>
  </v-scale-screen>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VScaleScreen from 'v-scale-screen';

const btnArr = ref([
  { num: 'one', url: '安全基础.png' },
  { num: 'two', url: '重大危险源.png' },
  { num: 'three', url: '双重预防.png' },
  { num: 'four', url: '特殊作业.png' },
]);

const getImageUrl = (url: string) => {
  try {
    return new URL(`/src/assets/images/${url}`, import.meta.url).href;
  } catch {
    console.warn('图片路径错误:', url);
    return '';
  }
};
const btnClassHandle = (key: string) => {
  return `btn-item-${key}`;
};
</script>

<style scoped lang="scss">
.box {
  position: relative;
  width: 100%;
  height: 100%;
}

.dv-index-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../../../src/assets/images/大屏首页.png') no-repeat;
  background-size: 100% 100%;

  .dv-btn-group {
    position: absolute;
    bottom: 127px;
    left: 0;
    width: 100%;
    height: 370px;

    .btn-item {
      position: absolute;
      width: 145px;
      height: 168px;
      cursor: pointer;
      transition: transform .3s;
    }

    .btn-item-one {
      top: 143px;
      left: 298px;
    }

    .btn-item-two {
      top: 194px;
      left: 689px;
    }

    .btn-item-three {
      top: 194px;
      right: 683px;
    }

    .btn-item-four {
      top: 143px;
      right: 298px;
    }


    .btn-item:hover {
      transform: scale(1.2);
    }
  }
}
</style>
