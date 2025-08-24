<!--
 - [위젯 추가위험발굴/부적합보고서 통계 컴포넌트]
 -
 - 관리책임: 정우근
 - 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 -     1. 2025-08-07 / 정우근 / - / 최초작성
 -->

<template>
  <v-container fluid class="pa-0 fill-height align-start">
    <v-card flat class="w-100 pa-3">
      <v-card-text>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line />
      </v-card-text>

      <v-data-table :headers="headers" :items="datas" :search="search" :items-per-page="-1" hide-default-footer></v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
export type DatatableType<T> = {
  data: T;
  recordsFiltered: number;
  draw: string;
  recordsTotal: number;
};

type DataType = {
  coopCompanyName: string;
  addRegTotal: number;
  addActTotal: number;
  addNeedTotal: number;
  ncrRegTotal: number;
  ncrActTotal: number;
  ncrNeedTotal: number;
};

const api = useApi();

const search = ref('');

const headers = [
  { key: 'coopCompanyName', title: '기업/협력사', align: 'start' },
  {
    title: '추가위험발굴',
    align: 'center',
    children: [
      { key: 'addRegTotal', title: '지시', align: 'center' },
      { key: 'addActTotal', title: '조치', align: 'center' },
      { key: 'addNeedTotal', title: '미조치', align: 'center' },
    ],
  },
  {
    title: '부적합보고서',
    align: 'center',
    children: [
      { key: 'ncrRegTotal', title: '발행', align: 'center' },
      { key: 'ncrActTotal', title: '조치', align: 'center' },
      { key: 'ncrNeedTotal', title: '미조치', align: 'center' },
    ],
  },
] as const;

const queryParams = {
  companyId: '30212',
  projCode: 'R001',
  draw: '1',
  start: 1,
  length: 1000,
  text: search.value,
};

const { data } = await api.fetch<DatatableType<DataType[]>>('/v1/rest/dashboard/widget/sample/010/1st', {
  query: queryParams,
});

const datas = computed<DataType[] | undefined>(() => data.value?.data as DataType[] | undefined);
</script>
