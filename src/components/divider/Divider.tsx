import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

/** Соответствует вариантам линии в Figma (`calm` / `loud`). */
export type DividerAppearance = 'calm' | 'loud';
export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  appearance?: DividerAppearance;
  orientation?: DividerOrientation;
}

type StyledProps = {
  $appearance: DividerAppearance;
  $orientation: DividerOrientation;
};

const appearanceStyles = {
  calm: css`
    background-color: ${({ theme }) => theme.colors.divider.background.calm.enabled};
  `,
  loud: css`
    background-color: ${({ theme }) => theme.colors.divider.background.loud.enabled};
  `,
} as const;

const orientationStyles = {
  horizontal: css`
    width: 100%;
    height: ${({ theme }) => theme.spacing.inner.xsClosest};
    align-self: stretch;
    flex-shrink: 0;
  `,
  vertical: css`
    width: ${({ theme }) => theme.spacing.inner.xsClosest};
    min-height: ${({ theme }) => theme.spacing.height.xSmall};
    align-self: stretch;
    flex-shrink: 0;
  `,
} as const;

const Root = styled.div<StyledProps>`
  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;

  ${({ $appearance }) => appearanceStyles[$appearance]}
  ${({ $orientation }) => orientationStyles[$orientation]}
`;

export const Divider = ({
  appearance = 'calm',
  orientation = 'horizontal',
  className,
  role = 'separator',
  'aria-orientation': ariaOrientationProp,
  ...rest
}: DividerProps) => {
  const ariaOrientation =
    ariaOrientationProp ?? (orientation === 'vertical' ? 'vertical' : 'horizontal');

  return (
    <Root
      $appearance={appearance}
      $orientation={orientation}
      className={className}
      role={role}
      aria-orientation={ariaOrientation}
      {...rest}
    />
  );
};
