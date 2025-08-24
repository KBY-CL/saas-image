/**
 * <pre>
 * [API]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-13 / 정우근 / - / 최초작성
 * </pre>
 */

import { defu } from 'defu';
import { callHook, type MaybeRefHookType } from '~/utils/fetchHook';
import type { UseFetchOptions } from 'nuxt/app';
import type { FetchContext } from 'ofetch';

export type ApiResponseType<T> = {
  timestamp: string;
  dataType: string;
  totalDataCnt: number;
  currentDataCnt: number;
  data: T;
};

export type ApiErrorType = {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
};

export const useApi = () => {
  const fetch = <T>(url: string, options: UseFetchOptions<ApiResponseType<T>> = {}) => {
    const config = useRuntimeConfig();
    const route = useRoute();

    const defaultOnRequest = ({ options }: FetchContext) => {
      console.log('기본 onRequest 실행', options);
    };

    const defaultOnResponse = ({ response }: FetchContext) => {
      console.log('기본 onResponse 실행', response);
    };

    const defaults: UseFetchOptions<ApiResponseType<T>> = {
      baseURL: config.public.apiBaseUrl,
      key: `${options.method || 'GET'}:${url}:${JSON.stringify(route.params)}:${JSON.stringify(options.query || '')}`,
      immediate: true,
      lazy: true,
      headers: {
        Accept: 'application/json',
      },
      onRequest(ctx) {
        defaultOnRequest(ctx);
        callHook(options?.onRequest as MaybeRefHookType, ctx);
      },
      onResponse(ctx) {
        defaultOnResponse(ctx);
        callHook(options?.onResponse as MaybeRefHookType, ctx);
      },
      onResponseError({ response }) {
        const body = response._data as ApiErrorType | undefined;
        console.error('기본 API Error:', body, response.statusText);
      },
      onRequestError({ error }) {
        console.error('기본 request error:', error);
      },
    };

    const merged = defu(options, defaults);

    return useFetch<ApiResponseType<T>>(url, merged);
  };

  return { fetch };
};
