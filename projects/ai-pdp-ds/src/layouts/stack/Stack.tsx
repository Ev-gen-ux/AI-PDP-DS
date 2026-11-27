import type { ReactNode } from 'react';
import { styled, css } from 'styled-components';
import type { Theme } from '@/theme/tokens';

type GapToken = keyof Theme['spacing']['inner'] | keyof Theme['spacing']['outer'];

export interface StackProps {
  gap?: GapToken;
  children?: ReactNode;
}

type StackStyledProps = {
  $gap: GapToken;
};

const gapStyles = (gap: GapToken) => css`
  gap: ${({ theme }) =>
    theme.spacing.inner[gap as keyof Theme['spacing']['inner']] ??
    theme.spacing.outer[gap as keyof Theme['spacing']['outer']]};
`;

const Root = styled.div<StackStyledProps>`
  display: flex;
  flex-direction: column;
  ${(props) => gapStyles(props.$gap)}
`;

export const Stack = ({ gap = 'related', children }: StackProps) => {
  return <Root $gap={gap}>{children}</Root>;
};
