import { type ButtonHTMLAttributes } from 'react';
import { styled, css } from 'styled-components';
import { Icon, sunIconGlyph } from '@/components/icon';
import { Spinner } from '@/components/spinner';

export type ToggleButtonAppearance = 'primary' | 'secondary';
export type ToggleButtonState = 'enabled' | 'hover' | 'active' | 'focus' | 'disabled';

export interface ToggleButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  appearance?: ToggleButtonAppearance;
  state?: ToggleButtonState;
  selected?: boolean;
  loading?: boolean;
  text?: string;
}

type StyledProps = {
  $appearance: ToggleButtonAppearance;
  $state: ToggleButtonState;
  $selected: boolean;
  $loading: boolean;
};

const toggleStyles = {
  primary: {
    enabled: css<StyledProps>`
      background-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.primary.backgroundSelected.enabled
          : theme.colors.toggleButton.primary.background.enabled};
      border-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.primary.borderSelected.enabled
          : theme.colors.toggleButton.primary.border.enabled};
      color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.primary.labelSelected.enabled
          : theme.colors.toggleButton.primary.label.enabled};
    `,
    hover: css<StyledProps>`
      background-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.primary.backgroundSelected.hover
          : theme.colors.toggleButton.primary.background.hover};
    `,
    active: css<StyledProps>`
      background-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.primary.backgroundSelected.active
          : theme.colors.toggleButton.primary.background.active};
    `,
    focus: css`
      box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
    `,
    disabled: css`
      background-color: transparent;
      border-color: ${({ theme }) => theme.colors.toggleButton.primary.border.disabled};
      color: ${({ theme }) => theme.colors.toggleButton.primary.label.disabled};
      cursor: not-allowed;
    `,
  },
  secondary: {
    enabled: css<StyledProps>`
      background-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.secondary.backgroundSelected.enabled
          : theme.colors.toggleButton.secondary.background.enabled};
      border-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.secondary.borderSelected.enabled
          : theme.colors.toggleButton.secondary.border.enabled};
      color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.secondary.iconSelected.enabled
          : theme.colors.toggleButton.secondary.icon.enabled};
    `,
    hover: css<StyledProps>`
      background-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.secondary.backgroundSelected.hover
          : theme.colors.toggleButton.secondary.background.hover};
    `,
    active: css<StyledProps>`
      background-color: ${({ theme, $selected }) =>
        $selected
          ? theme.colors.toggleButton.secondary.backgroundSelected.active
          : theme.colors.toggleButton.secondary.background.active};
    `,
    focus: css`
      box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
    `,
    disabled: css`
      background-color: transparent;
      border-color: ${({ theme }) => theme.colors.toggleButton.secondary.border.disabled};
      color: ${({ theme }) => theme.colors.toggleButton.secondary.icon.disabled};
      cursor: not-allowed;
    `,
  },
} as const;

const forcedStateStyles = {
  hover: css<StyledProps>`
    ${({ $appearance }) => toggleStyles[$appearance].hover}
  `,
  active: css<StyledProps>`
    ${({ $appearance }) => toggleStyles[$appearance].active}
  `,
  focus: css<StyledProps>`
    ${({ $appearance }) => toggleStyles[$appearance].focus}
  `,
  disabled: css<StyledProps>`
    ${({ $appearance }) => toggleStyles[$appearance].disabled}
  `,
} as const;

const Root = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
  ${({ $appearance }) => toggleStyles[$appearance].enabled}

  ${({ theme, $appearance }) =>
    $appearance === 'primary'
      ? css`
          height: ${theme.spacing.height.small};
          padding: 0 ${theme.spacing.paddings.compact};
          font-size: ${theme.typography.fontSize.component.small};
          line-height: ${theme.typography.lineHeight.text.small};
        `
      : css`
          width: ${theme.spacing.height.small};
          height: ${theme.spacing.height.small};
          padding: ${theme.spacing.paddings.compact};
          font-size: ${theme.typography.fontSize.component.small};
          line-height: ${theme.typography.lineHeight.text.small};
        `}

  &:focus-visible {
    outline: none;
    ${({ $appearance }) => toggleStyles[$appearance].focus}
  }

  &:hover:enabled {
    ${({ $appearance }) => toggleStyles[$appearance].hover}
  }

  &:active:enabled {
    ${({ $appearance }) => toggleStyles[$appearance].active}
  }

  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
    `}

  ${({ $state }) => ($state !== 'enabled' ? forcedStateStyles[$state] : null)}
`;

const ICON_SIZE = 16 as const;

export const ToggleButton = ({
  appearance = 'primary',
  state = 'enabled',
  selected = false,
  loading = false,
  text = 'Toggle Button',
  disabled,
  type = 'button',
  ...rest
}: ToggleButtonProps) => {
  const isDisabled = Boolean(disabled || loading || state === 'disabled');
  const resolvedState: ToggleButtonState = isDisabled ? 'disabled' : state;

  return (
    <Root
      type={type}
      $appearance={appearance}
      $state={loading ? 'enabled' : resolvedState}
      $selected={selected}
      $loading={loading}
      disabled={isDisabled}
      aria-pressed={selected}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={ICON_SIZE} />
      ) : appearance === 'secondary' ? (
        <Icon icon={sunIconGlyph} size={ICON_SIZE} aria-hidden="true" />
      ) : (
        <span>{text}</span>
      )}
    </Root>
  );
};
