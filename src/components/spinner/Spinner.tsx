import { useId } from 'react';
import { styled, css, keyframes, useTheme } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

export type SpinnerSize = 16 | 24 | 32 | 40;

export interface SpinnerProps {
  size?: SpinnerSize;
  'aria-label'?: string;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const sizeStyles = {
  16: css`
    width: ${({ theme }) => theme.spacing.height['2xSmall']};
    height: ${({ theme }) => theme.spacing.height['2xSmall']};
  `,
  24: css`
    width: ${({ theme }) => theme.spacing.height.xSmall};
    height: ${({ theme }) => theme.spacing.height.xSmall};
  `,
  32: css`
    width: ${({ theme }) => theme.spacing.height.small};
    height: ${({ theme }) => theme.spacing.height.small};
  `,
  40: css`
    width: ${({ theme }) => theme.spacing.height.base};
    height: ${({ theme }) => theme.spacing.height.base};
  `,
} as const;

function strokeWidthForSize(size: SpinnerSize, theme: DefaultTheme): string {
  switch (size) {
    case 16:
      return theme.spacing.inner.xsClosest;
    case 24:
    case 32:
      return theme.spacing.inner.closest;
    case 40:
      return theme.spacing.inner.close;
  }
}

const Root = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;

const Svg = styled.svg<{ $size: SpinnerSize }>`
  display: block;
  flex-shrink: 0;
  animation: ${spin} 0.85s linear infinite;

  ${({ $size }) => sizeStyles[$size]}
`;

export const Spinner = ({ size = 24, 'aria-label': ariaLabel = 'Loading' }: SpinnerProps) => {
  const theme = useTheme();
  const reactId = useId();
  const gradId = `spinner-grad-${reactId.replace(/:/g, '')}`;
  const color = theme.colors.spinner.border.calm.enabled;
  const strokeW = strokeWidthForSize(size, theme);

  return (
    <Root role="status" aria-label={ariaLabel}>
      <Svg
        $size={size}
        viewBox="0 0 100 100"
        focusable="false"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientTransform="rotate(24)"
          >
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeW}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="78 100"
        />
      </Svg>
    </Root>
  );
};
