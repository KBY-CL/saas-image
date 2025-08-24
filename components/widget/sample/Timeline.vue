<!--
 - [위젯 타임라인 컴포넌트 샘플]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="pa-0">
    <v-card class="mx-auto">
      <v-card-text>
        <v-sheet class="font-weight-bold ms-1 mb-2">Today</v-sheet>

        <v-timeline align="start" density="compact">
          <v-timeline-item v-for="message in messages" :key="message.time" :dot-color="message.color" size="x-small">
            <v-sheet class="mb-4">
              <v-sheet class="font-weight-normal">
                <strong>{{ message.from }}</strong> @{{ message.time }}
              </v-sheet>

              <v-sheet>{{ message.message }}</v-sheet>
            </v-sheet>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const messages = [
  {
    from: 'You',
    message: `Sure, I'll see you later.`,
    time: '10:42am',
    color: 'deep-purple-lighten-1',
  },
  {
    from: 'John Doe',
    message: 'Yeah, sure. Does 1:00pm work?',
    time: '10:37am',
    color: 'green',
  },
  {
    from: 'You',
    message: 'Did you still want to grab lunch today?',
    time: '9:47am',
    color: 'deep-purple-lighten-1',
  },
];
</script>
