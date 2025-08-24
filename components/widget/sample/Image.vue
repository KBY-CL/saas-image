<!--
 - [위젯 이미지 컴포넌트 샘플]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="fill-height pa-0">
    <v-carousel show-arrows="hover" cycle hide-delimiter-background class="fill-height">
      <v-carousel-item v-for="(img, i) in images" :key="i" :src="img" cover class="cursor-pointer" @click="open(i)"></v-carousel-item>
    </v-carousel>
  </v-container>

  <VueEasyLightbox :visible="show" :imgs="images" :index="index" :loop="true" @hide="show = false" />
</template>

<script setup lang="ts">
const images = [
  'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
];

const show = ref(false);
const index = ref(0);

function open(i: number) {
  index.value = i;
  show.value = true;
}
</script>
