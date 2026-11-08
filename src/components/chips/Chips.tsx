import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { styled, css } from 'styled-components';
import { Icon, metaIconGlyph, xIconGlyph } from '@/components/icon';

export type ChipsState = 'enabled' | 'hover' | 'active' | 'focus' | 'disabled';
export type ChipsSize = 'small (32px)' | 'extra small (24px)';

export interface ChipsProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  state?: ChipsState;
  size?: ChipsSize;
  iconBefore?: ReactNode | boolean;
  closable?: boolean;
  label?: string;
}

type StyledProps = {
  $state: ChipsState;
  $size: ChipsSize;
};

type IconSlotProps = { $state: ChipsState; $tone: 'icon' | 'close' };

const stateStyles = {
  enabled: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.chips.background.calm.enabled};
    color: ${({ theme }) => theme.colors.chips.label.calm.enabled};
  `,
  hover: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.chips.background.calm.hover};
    color: ${({ theme }) => theme.colors.chips.label.calm.enabled};
  `,
  active: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.chips.background.calm.active};
    color: ${({ theme }) => theme.colors.chips.label.calm.enabled};
  `,
  focus: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.chips.background.calm.enabled};
    color: ${({ theme }) => theme.colors.chips.label.calm.enabled};
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  `,
  disabled: css`
    border: 1px solid ${({ theme }) => theme.colors.chips.border.calm.disabled};
    background-color: transparent;
    color: ${({ theme }) => theme.colors.chips.label.calm.disabled};
    cursor: not-allowed;
  `,
} as const;

const sizeStyles = {
  'small (32px)': css`
    gap: ${({ theme }) => theme.spacing.inner.related};
    padding: ${({ theme }) => theme.spacing.paddings.compact}
      ${({ theme }) => theme.spacing.paddings.compactMedium};
  `,
  'extra small (24px)': css`
    gap: ${({ theme }) => theme.spacing.inner.close};
    height: ${({ theme }) => theme.spacing.height.small};
    padding: ${({ theme }) => theme.spacing.inner.close}
      ${({ theme }) => theme.spacing.paddings.compact};
  `,
} as const;

const Root = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.component.extraSmall};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.extraSmall};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  ${({ $state }) => stateStyles[$state]}
  ${({ $size }) => sizeStyles[$size]}

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  ${({ $state }) =>
    $state === 'enabled'
      ? css`
          &:hover:enabled {
            ${stateStyles.hover}
          }

          &:active:enabled {
            ${stateStyles.active}
          }
        `
      : null}
`;

const IconSlot = styled.span<IconSlotProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $tone, $state }) =>
    $tone === 'icon'
      ? $state === 'disabled'
        ? theme.colors.chips.icon.calm.disabled
        : theme.colors.chips.icon.calm.enabled
      : $state === 'disabled'
        ? theme.colors.chips.buttonClose.calm.disabled
        : theme.colors.chips.buttonClose.calm.enabled};
`;

export const Chips = ({
  state = 'enabled',
  size = 'small (32px)',
  iconBefore = false,
  closable = false,
  label = 'Chips Label',
  disabled,
  type = 'button',
  ...rest
}: ChipsProps) => {
  const isDisabled = Boolean(disabled || state === 'disabled');
  const resolvedState: ChipsState = isDisabled ? 'disabled' : state;
  const iconNode =
    iconBefore === true ? <Icon icon={metaIconGlyph} size={16} aria-hidden="true" /> : iconBefore;

  return (
    <Root type={type} $state={resolvedState} $size={size} disabled={isDisabled} {...rest}>
      {iconNode ? (
        <IconSlot $state={resolvedState} $tone="icon">
          {iconBefore === true ? (
            <Icon icon={metaIconGlyph} size={16} aria-hidden="true" />
          ) : (
            iconNode
          )}
        </IconSlot>
      ) : null}
      <span>{label}</span>
      {closable ? (
        <IconSlot $state={resolvedState} $tone="close">
          <Icon icon={xIconGlyph} size={16} aria-hidden="true" />
        </IconSlot>
      ) : null}
    </Root>
  );
};
