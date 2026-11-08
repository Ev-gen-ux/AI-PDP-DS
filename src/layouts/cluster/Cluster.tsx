import type { ReactNode } from 'react';
import { styled, css } from 'styled-components';
import type { Theme } from '@/theme/tokens';

type InnerGap = keyof Theme['spacing']['inner'];

export interface ClusterProps {
  gap?: InnerGap;
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  children?: ReactNode;
}

type ClusterStyledProps = {
  $gap: InnerGap;
  $align: NonNullable<ClusterProps['align']>;
  $justify: NonNullable<ClusterProps['justify']>;
};

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
} as const;

const gapStyles = (gap: InnerGap) => css`
  gap: ${({ theme }) => theme.spacing.inner[gap]};
`;

const Root = styled.div<ClusterStyledProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: ${(props) => alignMap[props.$align]};
  justify-content: ${(props) => justifyMap[props.$justify]};
  ${(props) => gapStyles(props.$gap)}
`;

export const Cluster = ({
  gap = 'close',
  align = 'center',
  justify = 'start',
  children,
}: ClusterProps) => {
  return (
    <Root $gap={gap} $align={align} $justify={justify}>
      {children}
    </Root>
  );
};
