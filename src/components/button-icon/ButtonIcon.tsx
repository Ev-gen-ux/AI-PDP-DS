import { type ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Icon, caretDownIconGlyph, caretUpIconGlyph, metaIconGlyph } from '@/components/icon';
import { Spinner } from '@/components/spinner';

export type ButtonIconAppearance = 'primary' | 'secondary';
export type ButtonIconSize = 'large' | 'medium' | 'small';
export type ButtonIconGlyph = 'meta' | 'caret-down' | 'caret-up';

export interface ButtonIconProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  appearance?: ButtonIconAppearance;
  size?: ButtonIconSize;
  icon?: ButtonIconGlyph;
  loading?: boolean;
}

type StyledProps = {
  $appearance: ButtonIconAppearance;
  $size: ButtonIconSize;
  $loading: boolean;
};

const appearanceStyles = {
  primary: css`
    &:enabled {
      background-color: ${({ theme }) => theme.colors.button.icon.primary.background.enabled};
      color: ${({ theme }) => theme.colors.button.icon.primary.icon.enabled};
    }
    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.button.icon.primary.background.hover};
    }
    &:active:enabled {
      background-color: ${({ theme }) => theme.colors.button.icon.primary.background.active};
    }
    &:disabled {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.icon.primary.icon.disabled};
    }
  `,
  secondary: css`
    &:enabled {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.icon.secondary.icon.enabled};
    }
    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.button.icon.secondary.background.hover};
    }
    &:active:enabled {
      background-color: ${({ theme }) => theme.colors.button.icon.secondary.background.active};
    }
    &:disabled {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.icon.secondary.icon.disabled};
    }
  `,
} as const;

const sizeStyles = {
  large: css`
    width: ${({ theme }) => theme.spacing.height.large};
    height: ${({ theme }) => theme.spacing.height.large};
    padding: ${({ theme }) => theme.spacing.paddings.default};
  `,
  medium: css`
    width: ${({ theme }) => theme.spacing.height.base};
    height: ${({ theme }) => theme.spacing.height.base};
    padding: ${({ theme }) => theme.spacing.paddings.compactMedium};
  `,
  small: css`
    width: ${({ theme }) => theme.spacing.height.small};
    height: ${({ theme }) => theme.spacing.height.small};
    padding: ${({ theme }) => theme.spacing.paddings.compact};
  `,
} as const;

const Root = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;
  cursor: pointer;
  ${({ $appearance }) => appearanceStyles[$appearance]}
  ${({ $size }) => sizeStyles[$size]}

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
    `}
`;

export const ButtonIcon = ({
  appearance = 'primary',
  size = 'large',
  icon = 'meta',
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonIconProps) => {
  const isDisabled = Boolean(disabled || loading);
  const iconSize = size === 'large' ? 24 : 16;
  const iconMap = {
    meta: metaIconGlyph,
    'caret-down': caretDownIconGlyph,
    'caret-up': caretUpIconGlyph,
  } as const;

  return (
    <Root
      type={type}
      $appearance={appearance}
      $size={size}
      $loading={loading}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={iconSize} />
      ) : (
        <Icon icon={iconMap[icon]} size={iconSize} aria-hidden="true" />
      )}
    </Root>
  );
};
