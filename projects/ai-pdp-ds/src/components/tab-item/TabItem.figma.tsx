import type { TabItemProps } from './TabItem';

/**
 * Code Connect — component set `tabItem` (варианты state / isSelected).
 * Холст «✅ tab»: родительский фрейм с символами вкладки.
 * https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3301-19129
 */
export const figma = {
  nodeId: '3301:19129',
  props: {
    text: '',
    value: '',
    selected: [true, false],
    disabled: [true, false],
    state: ['enabled', 'hover', 'active', 'focus', 'disabled'],
  } satisfies Record<
    keyof Pick<TabItemProps, 'text' | 'value' | 'selected' | 'disabled' | 'state'>,
    unknown
  >,
};
