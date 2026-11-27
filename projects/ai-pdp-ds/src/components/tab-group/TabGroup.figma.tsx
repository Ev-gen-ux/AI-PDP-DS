import type { TabGroupProps } from './TabGroup';

/**
 * Code Connect — master `tabGroup` на холсте «✅ tab».
 * https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3301-19220
 */
export const figma = {
  nodeId: '3301:19220',
  props: {
    value: '',
    defaultValue: '',
  } satisfies Record<keyof Pick<TabGroupProps, 'value' | 'defaultValue'>, unknown>,
};
