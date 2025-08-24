/**
 * [초기화]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-14 / 정우근 / - / 최초작성
 */

import { useComponentsStore } from '~/stores/useComponentsStore';
import { usePagesStore } from '~/stores/usePagesStore';

export default defineNuxtPlugin(async () => {
  const componentStore = useComponentsStore();
  const pagesStore = usePagesStore();

  await componentStore.init();
  await pagesStore.init();
});
