<!--
 - [인덱스 페이지]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-01 / 정우근 / - / 최초작성
 -->

<template>
  <v-sheet></v-sheet>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const userLogic = useUserLogic();

onMounted(() => {
  if (config.public.stage === 'prod') {
    window.addEventListener('message', receiveMessage);
    sendMessage();
  } else {
    userLogic.init({
      companyId: '30212',
      companyName: '[개발(원)] 클라우드랩',
      userNo: '54796',
      userName: '정우근',
      projCode: 'R001',
      projName: '[개발(원)] 테스트현장',
    });

    navigateTo('/page-1');
  }
});

onBeforeUnmount(() => {
  if (config.public.stage === 'prod') {
    window.removeEventListener('message', receiveMessage);
  }
});

async function receiveMessage(event: MessageEvent) {
  if (event.origin !== window.location.origin) {
    console.error('Not allowed origin:', event.origin);
    return;
  }

  if (event.data.id == 'responseUserFromSpage') {
    await Promise.all([userLogic.init(event.data.user)]);
    navigateTo('/page-1');
  }
}

function sendMessage() {
  window.parent.postMessage({ id: 'requestUserToSpage' }, window.location.origin);
}
</script>
