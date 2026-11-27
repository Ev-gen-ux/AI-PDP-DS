import type { HTMLAttributes } from 'react';
import { styled, css, keyframes } from 'styled-components';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Неизвестный прогресс: сегмент движется по дорожке слева направо (имитация загрузки). */
  indeterminate?: boolean;
  /** Текущее значение (0…`max`). Игнорируется при `indeterminate`. */
  value?: number;
  /** Верхняя граница шкалы (как в `aria-valuemax`). Должно быть > 0. */
  max?: number;
}

type DeterminateTrackProps = {
  $percent: number;
};

const trackBase = css`
  box-sizing: border-box;
  width: 100%;
  height: ${({ theme }) => theme.spacing.height['4xSmall']};
  margin: 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  background-color: ${({ theme }) => theme.colors.progressBar.background.enabled};
  overflow: hidden;
`;

const DeterminateTrack = styled.div<DeterminateTrackProps>`
  ${trackBase}

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $percent }) => `${$percent}%`};
    border-radius: ${({ theme }) => theme.borderRadius.rounded};
    background-color: ${({ theme }) => theme.colors.progressBar.background.active};
    transition: width 0.15s ease;
  }
`;

const slideAlong = keyframes`
  from {
    left: -40%;
  }
  to {
    left: 100%;
  }
`;

const IndeterminateTrack = styled.div`
  ${trackBase}
  position: relative;
`;

const IndeterminateFill = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 40%;
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  background-color: ${({ theme }) => theme.colors.progressBar.background.active};
  animation: ${slideAlong} 1.2s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    left: 30%;
    width: 40%;
  }
`;

function normalizeProgress(
  value: number,
  max: number,
): { clamped: number; safeMax: number; percent: number } {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), safeMax);
  const percent = safeMax === 0 ? 0 : (clamped / safeMax) * 100;
  return { clamped, safeMax, percent };
}

export const ProgressBar = ({
  indeterminate = false,
  value = 0,
  max = 100,
  'aria-label': ariaLabel = 'Progress',
  ...rest
}: ProgressBarProps) => {
  const { clamped, safeMax, percent } = normalizeProgress(value, max);

  if (indeterminate) {
    return (
      <IndeterminateTrack role="progressbar" aria-label={ariaLabel} aria-busy={true} {...rest}>
        <IndeterminateFill aria-hidden />
      </IndeterminateTrack>
    );
  }

  return (
    <DeterminateTrack
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      aria-label={ariaLabel}
      $percent={percent}
      {...rest}
    />
  );
};
