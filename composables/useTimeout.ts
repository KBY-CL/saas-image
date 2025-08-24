/**
 * <pre>
 * [타임아웃]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-23 / 정우근 / - / 최초작성
 * </pre>
 */

export const useTimeout = () => {
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  return { sleep };
};
