/**
 * Code Connect — экземпляр Tab Item (уточните node-id варианта в Figma при публикации).
 */
export const figma = {
  nodeId: '3301:18966',
  props: {
    text: '',
    selected: [true, false],
    disabled: [true, false],
    state: ['enabled', 'hover', 'active', 'focus', 'disabled'],
  } satisfies Record<string, unknown>,
};
