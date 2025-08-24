/**
 * [$fetch 기본 설정]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-12 / 정우근 / - / 최초작성
 */

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ options }) {
      options.headers = {
        ...options.headers,
      };
    },
    onResponse({ response }) {
      console.log('API Response:', response);
    },
    onResponseError({ response }) {
      console.error(`API Error: ${response.status}`, response._data);
    },
  });

  return {
    provide: {
      api,
    },
  };
});
