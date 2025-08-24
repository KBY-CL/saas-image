/**
 * <pre>
 * [사용자 로직]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-01 / 정우근 / - / 최초작성
 * </pre>
 */

import type { UserProjType, UserType } from '~/stores/useUserStore';

export const useUserLogic = () => {
  const userStore = useUserStore();

  /**
   * 사용자 가져오기
   *
   * @returns 사용자
   */
  const get = () => computed(() => userStore.user);

  /**
   * 초기화
   */
  const init = async (aUser: UserType) => {
    userStore.init(aUser);
  };

  /**
   * 현장 변경
   */
  const changeProj = (aProj: UserProjType) => {
    userStore.setProj(aProj);
  };

  return {
    get,

    init,
    changeProj,
  };
};
