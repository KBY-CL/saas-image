/**
 * <pre>
 * [정적 리소스]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-21 / 정우근 / - / 최초작성
 * </pre>
 */

export const useResource = () => {
  const getPublic = (aPath: string): string => {
    const config = useRuntimeConfig();
    return config.app.baseURL + aPath.replace(/^\/+/, '');
  };

  return { getPublic };
};
