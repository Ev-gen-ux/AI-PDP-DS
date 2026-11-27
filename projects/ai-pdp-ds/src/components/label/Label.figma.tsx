import type { LabelProps } from './Label';

export const figma = {
  nodeId: '533:34637',
  props: {
    state: ['default', 'disabled'],
    required: [true, false],
  } satisfies Record<keyof Pick<LabelProps, 'state' | 'required'>, unknown>,
};
