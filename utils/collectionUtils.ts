/**
 * <pre>
 * [Object Utils]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-19 / 정우근 / - / 최초작성
 * </pre>
 */

export function arrayToRecord<T, K extends keyof T>(aArray: T[], aId: K) {
  return aArray.reduce(
    (acc, item) => {
      acc[String(item[aId])] = item;
      return acc;
    },
    {} as Record<string, T>
  );
}
