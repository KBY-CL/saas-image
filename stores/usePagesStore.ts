/**
 * [페이지 스토어]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-19 / 정우근 / - / 최초작성
 */

import { arrayToRecord } from '~/utils/collectionUtils';
import type { ComponentMapKeyType } from '~/stores/useComponentsStore';
import type { GridStack } from 'gridstack';

export type GridStackType = InstanceType<typeof GridStack>;

/**
 * 그리드스택 위젯 타입
 *
 * @property id 위젯 ID
 * @property name 타이틀
 * @property x x좌표
 * @property y y좌표
 * @property w 넓이
 * @property h 높이
 */
export type GridStackWidgetType = {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * 위젯 타입
 *
 * @property id ID
 * @property name 타이틀
 * @property x x좌표
 * @property y y좌표
 * @property w 넓이
 * @property h 높이
 * @property widgetId 위젯 ID
 * @property componentId 컴포넌트 ID
 * @property isConfigurable 설정가능여부
 */
export type WidgetType<K extends ComponentMapKeyType = ComponentMapKeyType> = {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  widgetId: string;
  componentId: K;
  isConfigurable?: boolean;
  configs?: K extends keyof ComponentConfigsMapType ? ComponentConfigsMapType[K] : never;
};

/**
 * 페이지 타입
 *
 * @property pageId 페이지 ID
 * @property name 이름
 * @property icon 아이콘
 * @property path 경로
 * @property isActive 활성화 여부
 * @property widgets 위젯 목록
 * @property temporaryWidgets 임시저장 위젯 목록
 * @property gridStack 그리드스택 객체
 */
export type PageType = {
  pageId: string;
  name: string;
  path: string;
  isActive: boolean;
  widgets?: WidgetType[];
  temporaryWidgets?: WidgetType[];
};

/**
 * 페이지 목록 타입
 */
export type PageListType = Record<string, PageType>;

export const usePagesStore = defineStore('pagesStore', () => {
  const temporaryData = useTemporaryData();
  const serialization = useSerialization();

  const _pages = ref<PageListType>({});

  const _gridStacks = markRaw(new Map<string, GridStackType>());

  const pages = computed<Readonly<PageListType>>(() => _pages.value);
  const page = computed<Readonly<PageType | undefined>>(() => Object.values(_pages.value).find((i) => i.isActive));

  // TODO: DB에서 참조하도록 변경
  async function init() {
    const componentsStore = useComponentsStore();

    _pages.value = arrayToRecord(temporaryData.rPageDatas, 'pageId');

    Object.values(_pages.value).forEach((i) => {
      i.widgets?.forEach((aWidgetItem) => {
        const component = componentsStore.components[aWidgetItem.componentId];
        aWidgetItem.isConfigurable = !!component?.isConfigurable;
      });

      i.temporaryWidgets = serialization.snapshot(i.widgets);
    });
  }

  function getPage(aPageId: string) {
    return computed<Readonly<PageType | undefined>>(() => pages.value[aPageId]);
  }

  function addPage(aName?: string) {
    const nPageIdMaxNum = Math.max(...Object.values(pages.value).map((p) => Number(p.pageId.replace('page', '')))) + 1;
    const sId = `page${nPageIdMaxNum}`;

    const tNewPage: PageType = {
      pageId: sId,
      name: aName ?? `Page ${nPageIdMaxNum}`,
      path: `/page-${nPageIdMaxNum}`,
      isActive: false,
      widgets: [],
      temporaryWidgets: [],
    };

    _pages.value[sId] = tNewPage;

    return tNewPage;
  }

  function deletePage(aPageId: string) {
    Reflect.deleteProperty(_pages.value, aPageId);
  }

  function setActivePage(aPageId: string) {
    if (!_pages.value) return;

    Object.values(_pages.value).forEach((page) => {
      page.isActive = page.pageId === aPageId;
    });
  }

  function setPageConfigs(aPageId: string, aName: string) {
    const tPage = _pages.value[aPageId];
    if (!tPage) return;

    tPage.name = aName;
  }

  function setGridStack(aGridStack: GridStackType) {
    if (!page.value) return;

    _gridStacks.set(page.value.pageId, aGridStack);
  }

  function getGridStack() {
    if (!page.value) return;

    return _gridStacks.get(page.value.pageId);
  }

  function setTemporaryWidgets() {
    if (!page.value) return;

    const tGridStack = getGridStack();
    if (!tGridStack) return;

    const rSavedData = tGridStack.save();
    if (!Array.isArray(rSavedData)) return;

    const tPage = _pages.value[page.value.pageId];
    if (!tPage) return;

    tPage.temporaryWidgets = rSavedData.map((aItem) => {
      const tTemporaryWidget = _getTemporaryWidget(aItem.id);

      return {
        id: aItem.id ?? '',
        name: tTemporaryWidget?.name ?? '',
        x: aItem.x ?? 0,
        y: aItem.y ?? 0,
        w: aItem.w ?? 1,
        h: aItem.h ?? 1,
        widgetId: aItem.id ?? '',
        componentId: tTemporaryWidget?.componentId ?? 'WidgetCommonBlank',
        isConfigurable: tTemporaryWidget?.isConfigurable ?? false,
        configs: tTemporaryWidget?.configs,
      };
    });
  }

  function _getTemporaryWidget(aWidgetId?: string) {
    if (!aWidgetId) return;
    if (!page.value || !page.value.temporaryWidgets) return;

    return page.value.temporaryWidgets.find((i) => i.widgetId === aWidgetId);
  }

  function addTemporaryWidget(aWidget: WidgetType) {
    if (!page.value) return;

    const tPage = _pages.value[page.value.pageId];
    if (!tPage || !tPage.temporaryWidgets) return;

    tPage.temporaryWidgets.push(aWidget);
  }

  function patchTemporaryWidget(aWidgetId: string, aComponentId: ComponentMapKeyType, aName: string, aIsConfigurable: boolean) {
    const tWidget = _getTemporaryWidget(aWidgetId);
    if (!tWidget) return;

    tWidget.componentId = aComponentId;
    tWidget.name = aName;
    tWidget.isConfigurable = aIsConfigurable;

    setTemporaryWidgets();
  }

  function patchTemporaryWidgetConfigs<K extends Extract<ComponentMapKeyType, keyof ComponentConfigsMapType>>(aWidgetId: string, aName: string, configs?: ComponentConfigsMapType[K]) {
    const tWidget = _getTemporaryWidget(aWidgetId);
    if (!tWidget) return;

    tWidget.name = aName;
    tWidget.configs = configs;
  }

  function deleteTemporaryWidget(aWidgetId: string) {
    if (!page.value) return;

    const tPage = _pages.value[page.value.pageId];
    if (!tPage || !tPage.temporaryWidgets) return;

    const tGridStack = getGridStack();
    if (!tGridStack) return;

    tPage.temporaryWidgets = tPage.temporaryWidgets?.filter((aItem) => aItem.widgetId !== aWidgetId);

    const oNode = tGridStack.engine.nodes.find((aNode) => aNode.id === aWidgetId);
    if (oNode && oNode.el) tGridStack.removeWidget(oNode.el, true);
  }

  function addGridStackWidget(aGridStackWidget: GridStackWidgetType) {
    const tGridStack = getGridStack();
    if (!tGridStack) return;

    tGridStack.addWidget(aGridStackWidget);
  }

  function reloadWidgets() {
    if (!page.value || !page.value.temporaryWidgets) return;

    const tGridStack = getGridStack();
    if (!tGridStack) return;

    tGridStack.removeAll();
    tGridStack.load(page.value.temporaryWidgets);
  }

  function refreshWidgets() {
    if (!page.value) return;

    const tPage = _pages.value[page.value.pageId];
    if (!tPage || !tPage.pageId) return;

    tPage.temporaryWidgets = serialization.snapshot(tPage.widgets);

    reloadWidgets();
  }

  function save() {
    if (!page.value) return;

    const tPage = _pages.value[page.value.pageId];
    if (!tPage || !tPage.temporaryWidgets) return;

    setTemporaryWidgets();

    tPage.widgets = tPage.temporaryWidgets;
    console.info('widgets saved: ', tPage.widgets);
  }

  return {
    pages,
    page,

    init,
    getPage,
    addPage,
    deletePage,
    setActivePage,
    setPageConfigs,
    setGridStack,
    getGridStack,
    setTemporaryWidgets,
    addTemporaryWidget,
    patchTemporaryWidget,
    patchTemporaryWidgetConfigs,
    deleteTemporaryWidget,
    addGridStackWidget,
    reloadWidgets,
    refreshWidgets,
    save,
  };
});
