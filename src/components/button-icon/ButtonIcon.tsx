import { type ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Icon, metaIconGlyph } from '@/components/icon';
import { Spinner } from '@/components/spinner';

export type ButtonIconAppearance = 'primary' | 'secondary';

export interface ButtonIconProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> {
  appearance?: ButtonIconAppearance;
  loading?: boolean;
}

type StyledProps = {
  $appearance: ButtonIconAppearance;
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

const Root = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: ${({ theme }) => theme.spacing.height.large};
  height: ${({ theme }) => theme.spacing.height.large};
  padding: ${({ theme }) => theme.spacing.paddings.default};
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

const ICON_SIZE = 24 as const;

export const ButtonIcon = ({
  appearance = 'primary',
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonIconProps) => {
  const isDisabled = Boolean(disabled || loading);

  return (
    <Root
      type={type}
      $appearance={appearance}
      $loading={loading}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={ICON_SIZE} />
      ) : (
        <Icon icon={metaIconGlyph} size={ICON_SIZE} aria-hidden="true" />
      )}
    </Root>
  );
};
