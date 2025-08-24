/**
 * <pre>
 * [시계]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-17 / 정우근 / - / 최초작성
 * </pre>
 */

import CloudlabDatetime from '~/plugins/cloudlab/CloudlabDatetime.mjs';

export const useClock = () => {
  /**
   * HTML Element에 시계를 표시한다.
   *
   * @param {Element} aEl 시계를 표시할 HTML Element
   */
  const attach = (aEl: Element | null) => {
    const cloudlabDatetime = new CloudlabDatetime(aEl);
    cloudlabDatetime.start(1);
  };

  return { attach };
};
