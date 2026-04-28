import { CircleNotch } from '@phosphor-icons/react';
import { keyframes } from 'styled-components';
import styled from 'styled-components';

export type SpinnerSize = 16 | 24;

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

const Root = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: inherit;
  animation: ${spin} 0.8s linear infinite;
`;

export const Spinner = ({ size = 24, 'aria-label': ariaLabel = 'Loading' }: SpinnerProps) => {
  return (
    <Root role="status" aria-label={ariaLabel}>
      <CircleNotch size={size} weight="bold" />
    </Root>
  );
};
