/**
 * <pre>
 * [Datetime 모듈]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-07-18 / 정우근 / - / 최초작성
 * </pre>
 */

import dayjs from 'dayjs';
import 'dayjs/locale/ko';

export default class CloudlabDatetime {
  #dayjs;
  #element;

  /**
   * 생성자
   *
   * @param {Element} aEl Datetime을 표시할 HTML Element
   */
  constructor(aElement) {
    this.#dayjs = dayjs;
    this.#dayjs.locale('ko');

    this.#element = aElement;
  }

  /**
   * [private] 정보 갱신
   */
  #update() {
    const now = this.#dayjs();
    const formatted = now.format('YYYY년 M월 D일 dddd HH:mm:ss');

    this.#element.innerHTML = formatted;
  }

  /**
   * 시작
   *
   * @param {number} anRefreshSecond 갱신시간(초)
   */
  start(anRefreshSecond) {
    this.#update();
    setInterval(() => this.#update(), anRefreshSecond * 1000);
  }
}
