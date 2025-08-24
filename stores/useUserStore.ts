/**
 * [사용자 스토어]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-31 / 정우근 / - / 최초작성
 */

/**
 * 사용자 현장 타입
 *
 * @property projCode 현장코드
 * @property projName 현장명
 */
export type UserProjType = {
  projCode: string;
  projName: string;
};

/**
 * 사용자 타입
 *
 * @property companyId 회사ID
 * @property companyName 회사명
 * @property userNo 사용자번호
 * @property userName 사용자명
 * @property projCode 현장코드
 * @property projName 현장명
 */
export type UserType = {
  companyId: string;
  companyName: string;
  userNo: string;
  userName: string;
} & UserProjType;

export const useUserStore = defineStore('userStore', () => {
  const _user = ref<UserType>();
  const user = computed(() => _user.value as Readonly<UserType>);

  async function init(aUser?: UserType) {
    _user.value = aUser;
  }

  function setProj(aProj: UserProjType) {
    if (_user.value) {
      _user.value.projCode = aProj.projCode;
      _user.value.projName = aProj.projName;
    }
  }

  return { user, init, setProj };
});
