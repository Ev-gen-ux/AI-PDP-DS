import type { CSSProperties, ReactNode } from 'react';
import { styled } from 'styled-components';
import type { Theme } from '@/theme/tokens';

type OuterGap = keyof Theme['spacing']['outer'];

export interface GridProps {
  minItemWidth?: string;
  gap?: OuterGap;
  children?: ReactNode;
}

type GridStyledProps = {
  $gap: OuterGap;
};

const Root = styled.div<GridStyledProps>`
  display: grid;
  gap: ${({ theme, $gap }) => theme.spacing.outer[$gap]};
`;

export const Grid = ({ minItemWidth = '280px', gap = 'related', children }: GridProps) => {
  const style = {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
  } satisfies CSSProperties;
  return (
    <Root style={style} $gap={gap}>
      {children}
    </Root>
  );
};
