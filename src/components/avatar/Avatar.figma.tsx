import type { AvatarProps } from './Avatar';

export const figma = {
  nodeId: '620:48806',
  props: {
    state: ['enabled', 'hover', 'active'],
  } satisfies Record<keyof Pick<AvatarProps, 'state'>, unknown>,
};
