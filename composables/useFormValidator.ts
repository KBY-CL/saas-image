/**
 * <pre>
 * [폼 유효성 검사]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-08 / 정우근 / - / 최초작성
 * </pre>
 */

export const useFormValidator = () => {
  const required = (aValue: string) => !!aValue || '필수 입력 항목입니다.';

  return { required };
};
