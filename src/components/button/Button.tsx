import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import styled, { css } from 'styled-components';

type ButtonAppearance = 'primary' | 'outline' | 'flat';
type ButtonSize = 'large' | 'medium';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  loading?: boolean;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  text?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

type StyledProps = {
  $appearance: NonNullable<ButtonProps['appearance']>;
  $size: NonNullable<ButtonProps['size']>;
  $loading: boolean;
};

const appearanceStyles = {
  primary: css`
    &:enabled {
      border: none;
      background-color: ${({ theme }) => theme.colors.button.primary.background.enabled};
      color: ${({ theme }) => theme.colors.button.primary.label.enabled};
    }
    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.button.primary.background.hover};
    }
    &:active:enabled {
      background-color: ${({ theme }) => theme.colors.button.primary.background.active};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.colors.button.primary.background.disabled};
      color: ${({ theme }) => theme.colors.button.primary.label.disabled};
    }
  `,
  outline: css`
    border-width: 1px;
    border-style: solid;
    &:enabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.enabled};
      background-color: ${({ theme }) => theme.colors.button.outline.background.enabled};
      color: ${({ theme }) => theme.colors.button.outline.label.enabled};
    }
    &:hover:enabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.hover};
      background-color: ${({ theme }) => theme.colors.button.outline.background.hover};
    }
    &:active:enabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.active};
      background-color: ${({ theme }) => theme.colors.button.outline.background.active};
    }
    &:disabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.disabled};
      background-color: ${({ theme }) => theme.colors.button.outline.background.disabled};
      color: ${({ theme }) => theme.colors.button.outline.label.disabled};
    }
  `,
  flat: css`
    border: none;
    &:enabled {
      background-color: ${({ theme }) => theme.colors.button.flat.background.enabled};
      color: ${({ theme }) => theme.colors.button.flat.label.enabled};
    }
    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.button.flat.background.hover};
    }
    &:active:enabled {
      background-color: ${({ theme }) => theme.colors.button.flat.background.active};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.colors.button.flat.background.disabled};
      color: ${({ theme }) => theme.colors.button.flat.label.disabled};
    }
  `,
} as const;

const sizeStyles = {
  large: css`
    min-height: ${({ theme }) => theme.spacing.height.large};
    padding: 0 ${({ theme }) => theme.spacing.paddings.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.component.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  `,
  medium: css`
    min-height: ${({ theme }) => theme.spacing.height.medium};
    padding: 0 ${({ theme }) => theme.spacing.paddings.default};
    font-size: ${({ theme }) => theme.typography.fontSize.component.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.component.small};
  `,
} as const;

const Root = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.inner.close};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;
  cursor: pointer;
  ${(props) => appearanceStyles[props.$appearance]}
  ${(props) => sizeStyles[props.$size]}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.button.focusRing.enabled};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${(props) =>
    props.$loading &&
    css`
      opacity: 0.85;
      pointer-events: none;
    `}
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const Button = ({
  appearance = 'primary',
  size = 'large',
  loading = false,
  iconBefore,
  iconAfter,
  text,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const content = children ?? text;

  return (
    <Root
      type={type}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      $appearance={appearance}
      $size={size}
      $loading={loading}
      {...rest}
    >
      {iconBefore ? <IconSlot>{iconBefore}</IconSlot> : null}
      <span>{content}</span>
      {iconAfter ? <IconSlot>{iconAfter}</IconSlot> : null}
    </Root>
  );
};
