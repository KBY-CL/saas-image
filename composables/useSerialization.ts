/**
 * <pre>
 * [직렬화]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-12 / 정우근 / - / 최초작성
 * </pre>
 */

import * as devalue from 'devalue';

export const useSerialization = () => {
  const snapshot = <T>(v: T): T => devalue.parse(devalue.stringify(v));

  return { snapshot };
};
