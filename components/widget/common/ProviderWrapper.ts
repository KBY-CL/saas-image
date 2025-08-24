/**
 * <pre>
 * [Provider Wrapper]
 *
 * 관리책임: 정우근
 * 변경이력 (작성일자 / 작성자 / 요청자 / 내용):
 *     1. 2025-08-19 / 정우근 / - / 최초작성
 * </pre>
 */

import WidgetCommonFrame from '~/components/widget/common/Frame.vue';
import { PAGE, WIDGET } from '~/keys/provider';

export default defineComponent<{ widgetId: string }>({
  name: 'ProviderWrapper',
  props: ['rModel', 'widgetId'],
  setup(props) {
    const pageLogic = usePageLogic();

    provide<ComputedRef<Readonly<PageType | undefined>>>(PAGE, pageLogic.getActivePage());

    const widget = pageLogic.getWidget(props.widgetId);
    provide<ComputedRef<WidgetType | undefined>>(WIDGET, widget);

    return () => h(WidgetCommonFrame);
  },
});
