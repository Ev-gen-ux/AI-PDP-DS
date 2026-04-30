import {
  isValidElement,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import styled, { css } from 'styled-components';
import { fallbackIconGlyph, Icon } from '@/components/icon';
import { Spinner } from '@/components/spinner';

type ButtonAppearance = 'primary' | 'outline' | 'flat';
type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  loading?: boolean;
  iconBefore?: ReactNode | boolean;
  iconAfter?: ReactNode | boolean;
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
      border-color: transparent;
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
      border: 1px solid ${({ theme }) => theme.colors.button.primary.border.disabled};
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.primary.label.disabled};
    }
  `,
  outline: css`
    border-width: 1px;
    border-style: solid;
    &:enabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.enabled};
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.outline.label.enabled};
    }
    &:hover:enabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.enabled};
      background-color: ${({ theme }) => theme.colors.button.outline.background.hover};
    }
    &:active:enabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.enabled};
      background-color: ${({ theme }) => theme.colors.button.outline.background.active};
    }
    &:disabled {
      border-color: ${({ theme }) => theme.colors.button.outline.border.disabled};
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.outline.label.disabled};
    }
  `,
  flat: css`
    border-color: transparent;
    &:enabled {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.flat.label.enabled};
    }
    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.button.flat.background.hover};
    }
    &:active:enabled {
      background-color: ${({ theme }) => theme.colors.button.flat.background.active};
    }
    &:disabled {
      border-color: transparent;
      background-color: transparent;
      color: ${({ theme }) => theme.colors.button.flat.label.disabled};
    }
  `,
} as const;

const sizeStyles = {
  large: css`
    gap: ${({ theme }) => theme.spacing.inner.grouped};
    min-height: ${({ theme }) => theme.spacing.height.large};
    padding: 0 ${({ theme }) => theme.spacing.paddings.relaxed};
    font-size: ${({ theme }) => theme.typography.fontSize.component.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  `,
  medium: css`
    gap: ${({ theme }) => theme.spacing.paddings.compactSmall};
    min-height: ${({ theme }) => theme.spacing.height.base};
    padding: 0 ${({ theme }) => theme.spacing.paddings.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.component.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  `,
  small: css`
    gap: ${({ theme }) => theme.spacing.inner.related};
    min-height: ${({ theme }) => theme.spacing.height.small};
    padding: 0 ${({ theme }) => theme.spacing.paddings.compactMedium};
    font-size: ${({ theme }) => theme.typography.fontSize.component.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  `,
} as const;

const Root = styled.button<StyledProps>`
  display: inline-flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;
  cursor: pointer;
  ${(props) => appearanceStyles[props.$appearance]}
  ${(props) => sizeStyles[props.$size]}

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${(props) =>
    props.$loading &&
    css`
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
  const isDisabled = Boolean(disabled || loading);
  const content = children ?? text;
  const iconSize = size === 'large' ? 24 : 16;

  const resolveIcon = (iconProp: ReactNode | boolean | undefined) => {
    if (iconProp === undefined || iconProp === null || iconProp === false) {
      return null;
    }
    if (iconProp === true) {
      return <Icon icon={fallbackIconGlyph} size={iconSize} />;
    }
    if (typeof iconProp === 'string' || typeof iconProp === 'number' || isValidElement(iconProp)) {
      return iconProp;
    }
    // Storybook controls can pass {} for mixed prop types.
    return <Icon icon={fallbackIconGlyph} size={iconSize} />;
  };

  const beforeIconNode = resolveIcon(iconBefore);
  const afterIconNode = resolveIcon(iconAfter);

  return (
    <Root
      type={type}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      disabled={isDisabled}
      $appearance={appearance}
      $size={size}
      $loading={loading}
      {...rest}
    >
      {loading ? (
        <Spinner size={iconSize} />
      ) : (
        <>
          {beforeIconNode ? <IconSlot>{beforeIconNode}</IconSlot> : null}
          <span>{content}</span>
          {afterIconNode ? <IconSlot>{afterIconNode}</IconSlot> : null}
        </>
      )}
    </Root>
  );
};
