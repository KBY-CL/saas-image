/**
 * <pre>
 * [페이지 로직]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-01 / 정우근 / - / 최초작성
 * </pre>
 */

import type { GridStackType } from '~/stores/usePagesStore';

export const usePageLogic = () => {
  const pagesStore = usePagesStore();

  const componentLogic = useComponentLogic();
  const widgetSelectorLogic = useWidgetSelectorLogic();
  const snackbarLogic = useSnackbarLogic();

  /**
   * 페이지 목록 가져오기
   */
  const getPages = () => computed<Readonly<PageListType>>(() => pagesStore.pages);

  /**
   * 활성화된 페이지 가져오기
   */
  const getActivePage = () => computed<Readonly<PageType | undefined>>(() => pagesStore.page);

  /**
   * 초기화
   */
  const init = async () => {
    pagesStore.init();
  };

  /**
   * 페이지 가져오기
   *
   * @param aPageId 페이지 ID
   */
  const getPage = (aPageId: string) => computed(() => pagesStore.getPage(aPageId));

  /**
   * 페이지 추가
   *
   * @param aName 페이지명
   */
  const addPage = (aName?: string) => {
    const newPage = pagesStore.addPage(aName);

    snackbarLogic.showSuccess('페이지가 추가되었습니다.');

    return newPage;
  };

  /**
   * 페이지 삭제
   *
   * @param aPageId 페이지 ID
   */
  const deletePage = (aPageId: string) => {
    pagesStore.deletePage(aPageId);

    snackbarLogic.showSuccess('페이지가 삭제되었습니다.');
  };

  /**
   * 활성화 페이지 설정
   *
   * @param aPageId 페이지 ID
   */
  const setActivePage = (aPageId: string) => {
    pagesStore.setActivePage(aPageId);
  };

  /**
   * 페이지 옵션 변경
   *
   * @param aPageId 페이지 ID
   * @param aName 이름
   */
  const changePageConfigs = (aPageId: string, aName: string) => {
    pagesStore.setPageConfigs(aPageId, aName);
  };

  /**
   * 그리드스택 설정
   *
   * @param aGridStack 그리드스택 객체
   */
  const setGridStack = (aGridStack: GridStackType) => {
    pagesStore.setGridStack(aGridStack);
  };

  /**
   * 위젯 가져오기
   *
   * @param aWidgetId 위젯 ID
   * @returns 위젯
   */
  const getWidget = <K extends ComponentMapKeyType>(aWidgetId?: string) => computed(() => pagesStore.page?.temporaryWidgets?.find((aWidget): aWidget is WidgetType<K> => aWidget.widgetId === aWidgetId));

  /**
   * 위젯 추가
   */
  const addWidget = () => {
    widgetSelectorLogic.show(undefined, _callbackToAddTemporaryWidget);
  };

  const _callbackToAddTemporaryWidget = async (aIsConfirmed: boolean, aComponentId: ComponentMapKeyType, aName: string) => {
    if (!aIsConfirmed) return;

    const lPage = pagesStore.page;
    const lGridStack = pagesStore.getGridStack();

    if (!lPage || !lGridStack || !aComponentId || !aName) return;

    const nMaxY = lGridStack.engine.getRow() || 0;
    const nIdMaxNo = lPage.temporaryWidgets
      ?.map((aItem) => {
        const match = aItem.widgetId.match(/\d+/);
        return match ? Number(match[0]) : 0;
      })
      .reduce((max, num) => (num > max ? num : max), -Infinity);

    const oWidget = {
      id: 'widget' + ((nIdMaxNo ?? 0) + 1),
      name: aName,
      x: 0,
      y: nMaxY + 1,
      w: 2,
      h: 2,
      widgetId: 'widget' + ((nIdMaxNo ?? 0) + 1),
      componentId: aComponentId,
      isConfigurable: componentLogic.getComponent(aComponentId)?.isConfigurable || false,
    };

    pagesStore.addTemporaryWidget(oWidget);
    pagesStore.addGridStackWidget(oWidget);

    await nextTick();
    const el = document.querySelector(`[gs-id="${oWidget.widgetId}"]`) as HTMLElement;
    if (el) {
      el.tabIndex = -1;
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    snackbarLogic.showSuccess('위젯이 추가되었습니다.');
  };

  /**
   * 위젯 변경
   */
  const changeWidget = (aWidgetId: string, aComponentId: ComponentMapKeyType, aName: string, aIsConfigurable: boolean) => {
    pagesStore.patchTemporaryWidget(aWidgetId, aComponentId, aName, aIsConfigurable);
    pagesStore.reloadWidgets();

    snackbarLogic.showSuccess('위젯이 변경되었습니다.');
  };

  /**
   * 위젯 설정 변경
   */
  const changeWidgetConfigs = <K extends Extract<ComponentMapKeyType, keyof ComponentConfigsMapType>>(aWidgetId: string, aName: string, configs?: ComponentConfigsMapType[K]) => {
    pagesStore.patchTemporaryWidgetConfigs(aWidgetId, aName, configs);

    snackbarLogic.showSuccess('위젯의 설정이 변경되었습니다.');
  };

  /**
   * 위젯 삭제
   */
  const deleteWidget = (aWidgetId: string) => {
    pagesStore.deleteTemporaryWidget(aWidgetId);

    snackbarLogic.showSuccess('위젯이 삭제되었습니다.');
  };

  /**
   * 위젯 임시 저장
   */
  const saveWidgets = () => {
    pagesStore.setTemporaryWidgets();
  };

  /**
   * 전체 위젯 리로드
   */
  const reloadWidgets = () => {
    pagesStore.reloadWidgets();
  };

  /**
   * 새로고침
   */
  const refreshWidgets = () => {
    pagesStore.refreshWidgets();

    snackbarLogic.showSuccess('화면이 초기화 되었습니다.');
  };

  /**
   * 위젯 저장
   */
  const saveWidgetsToServer = () => {
    pagesStore.save();

    snackbarLogic.showSuccess('저장되었습니다.');
  };

  return {
    getPages,
    getActivePage,
    getPage,

    init,
    addPage,
    deletePage,
    setActivePage,
    changePageConfigs,
    setGridStack,
    getWidget,
    addWidget,
    changeWidget,
    changeWidgetConfigs,
    deleteWidget,
    saveWidgets,
    reloadWidgets,
    refreshWidgets,
    saveWidgetsToServer,
  };
};
