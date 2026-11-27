import type { HTMLAttributes } from 'react';
import { styled, css, type RuleSet } from 'styled-components';

export type CounterAppearance = 'primary' | 'secondary';
/** Имена размеров совпадают с вариантами Size в Figma master. */
export type CounterSize = 'extra small (16px)' | 'small (24px)';

export type CounterBucket = 'single' | 'double' | 'overflow99' | 'overflow999';

export interface CounterProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Неотрицательное целое; отображение с порогами 99+ и 999+. */
  value: number;
  appearance?: CounterAppearance;
  size?: CounterSize;
}

/** Формат числа для бейджа: `>99` → `99+`, `>999` → `999+`. */
export function formatCounterValue(raw: number): string {
  const n = Math.max(0, Math.floor(Number.isFinite(raw) ? raw : 0));
  if (n > 999) return '999+';
  if (n > 99) return '99+';
  return String(n);
}

export function counterLayoutBucket(label: string): CounterBucket {
  if (label === '999+') return 'overflow999';
  if (label === '99+') return 'overflow99';
  if (label.length >= 2) return 'double';
  return 'single';
}

type RootStyledProps = {
  $appearance: CounterAppearance;
  $size: CounterSize;
  $bucket: CounterBucket;
};

const appearanceStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.counter.background.calm.enabled};
    color: ${({ theme }) => theme.colors.counter.label.loud.enabled};
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.counter.background.loud.enabled};
    color: ${({ theme }) => theme.colors.counter.label.calm.enabled};
  `,
} as const;

const typographyStyles = {
  'extra small (16px)': css`
    font-size: ${({ theme }) => theme.typography.fontSize.component.extraSmall};
    line-height: ${({ theme }) => theme.typography.lineHeight.component.extraSmall};
  `,
  'small (24px)': css`
    font-size: ${({ theme }) => theme.typography.fontSize.component.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  `,
} as const;

const layoutExtraSmallSingle = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.extraSmallSingle};
  width: ${({ theme }) => theme.spacing.counter.minWidth.extraSmallSingle};
  height: ${({ theme }) => theme.spacing.height['2xSmall']};
  padding: 0;
`;

const layoutExtraSmallDouble = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.extraSmallDouble};
  height: ${({ theme }) => theme.spacing.height['2xSmall']};
  padding: 0;
`;

const layoutExtraSmallOverflow99 = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.extraSmallOverflow99};
  height: ${({ theme }) => theme.spacing.height['2xSmall']};
  padding: 0;
`;

const layoutExtraSmallOverflow999 = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.extraSmallOverflow999};
  height: ${({ theme }) => theme.spacing.height['2xSmall']};
  padding: 0;
`;

const layoutSmallSingle = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.smallSingle};
  width: ${({ theme }) => theme.spacing.counter.minWidth.smallSingle};
  height: ${({ theme }) => theme.spacing.height.xSmall};
  padding: 0;
`;

const layoutSmallDouble = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.smallDouble};
  height: ${({ theme }) => theme.spacing.height.xSmall};
  padding: 0;
`;

const layoutSmallOverflow99 = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.smallOverflow99};
  height: ${({ theme }) => theme.spacing.height.xSmall};
  padding: 0 ${({ theme }) => theme.spacing.inner.xsClosest};
`;

const layoutSmallOverflow999 = css<RootStyledProps>`
  min-width: ${({ theme }) => theme.spacing.counter.minWidth.smallOverflow999};
  height: ${({ theme }) => theme.spacing.height.xSmall};
  padding: 0 ${({ theme }) => theme.spacing.inner.xsClosest};
`;

const layoutBySizeAndBucket: Record<
  CounterSize,
  Record<CounterBucket, RuleSet<RootStyledProps>>
> = {
  'extra small (16px)': {
    single: layoutExtraSmallSingle,
    double: layoutExtraSmallDouble,
    overflow99: layoutExtraSmallOverflow99,
    overflow999: layoutExtraSmallOverflow999,
  },
  'small (24px)': {
    single: layoutSmallSingle,
    double: layoutSmallDouble,
    overflow99: layoutSmallOverflow99,
    overflow999: layoutSmallOverflow999,
  },
};

const Root = styled.span<RootStyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
  white-space: nowrap;

  ${({ $appearance }) => appearanceStyles[$appearance]}
  ${({ $size }) => typographyStyles[$size]}
  ${({ $size, $bucket }) => layoutBySizeAndBucket[$size][$bucket]}
`;

export const Counter = ({
  value,
  appearance = 'primary',
  size = 'extra small (16px)',
  className,
  ...rest
}: CounterProps) => {
  const label = formatCounterValue(value);
  const bucket = counterLayoutBucket(label);

  return (
    <Root $appearance={appearance} $size={size} $bucket={bucket} className={className} {...rest}>
      {label}
    </Root>
  );
};
