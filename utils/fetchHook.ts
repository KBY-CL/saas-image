/**
 * <pre>
 * [Fetch Hook]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-13 / 정우근 / - / 최초작성
 * </pre>
 */

import type { FetchContext, FetchHook } from 'ofetch';

type HookType = FetchHook<FetchContext>;
type HookValueType = HookType | HookType[] | null | undefined;
export type MaybeRefHookType = HookValueType | Ref<HookValueType>;

export function callHook(candidate: MaybeRefHookType, ctx: FetchContext) {
  const unwrapped = unref(candidate);
  if (!unwrapped) return;

  if (Array.isArray(unwrapped)) {
    for (const hook of unwrapped) {
      if (typeof hook === 'function') hook(ctx);
    }
  } else if (typeof unwrapped === 'function') {
    unwrapped(ctx);
  }
}
