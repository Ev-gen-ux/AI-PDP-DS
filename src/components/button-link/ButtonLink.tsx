import { type ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Icon, linkIconGlyph } from '@/components/icon';
import { Spinner } from '@/components/spinner';

export type ButtonLinkAppearance = 'primary' | 'secondary';
export type ButtonLinkState = 'enabled' | 'hover' | 'active' | 'focus' | 'disabled';

export interface ButtonLinkProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  appearance?: ButtonLinkAppearance;
  state?: ButtonLinkState;
  loading?: boolean;
  iconBefore?: boolean;
  iconAfter?: boolean;
  text?: string;
}

type StyledProps = {
  $appearance: ButtonLinkAppearance;
  $state: ButtonLinkState;
  $loading: boolean;
};

const stateStyles = {
  primary: {
    enabled: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.label.enabled};
    `,
    hover: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.label.hover};
    `,
    active: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.label.active};
    `,
    focus: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.label.focus};
      box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
    `,
    disabled: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.label.disabled};
      cursor: not-allowed;
    `,
  },
  secondary: {
    enabled: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.label.enabled};
    `,
    hover: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.label.hover};
    `,
    active: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.label.active};
    `,
    focus: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.label.focus};
      box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
    `,
    disabled: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.label.disabled};
      cursor: not-allowed;
    `,
  },
} as const;

const iconStateStyles = {
  primary: {
    enabled: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.icon.enabled};
    `,
    hover: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.icon.hover};
    `,
    active: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.icon.active};
    `,
    focus: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.icon.focus};
    `,
    disabled: css`
      color: ${({ theme }) => theme.colors.linkButton.primary.icon.disabled};
    `,
  },
  secondary: {
    enabled: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.icon.enabled};
    `,
    hover: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.icon.hover};
    `,
    active: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.icon.active};
    `,
    focus: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.icon.focus};
    `,
    disabled: css`
      color: ${({ theme }) => theme.colors.linkButton.secondary.icon.disabled};
    `,
  },
} as const;

const forcedStateStyles = {
  hover: css<StyledProps>`
    ${({ $appearance }) => stateStyles[$appearance].hover}
    & [data-slot='icon'] {
      ${({ $appearance }) => iconStateStyles[$appearance].hover}
    }
  `,
  active: css<StyledProps>`
    ${({ $appearance }) => stateStyles[$appearance].active}
    & [data-slot='icon'] {
      ${({ $appearance }) => iconStateStyles[$appearance].active}
    }
  `,
  focus: css<StyledProps>`
    ${({ $appearance }) => stateStyles[$appearance].focus}
    & [data-slot='icon'] {
      ${({ $appearance }) => iconStateStyles[$appearance].focus}
    }
  `,
  disabled: css<StyledProps>`
    ${({ $appearance }) => stateStyles[$appearance].disabled}
    & [data-slot='icon'] {
      ${({ $appearance }) => iconStateStyles[$appearance].disabled}
    }
  `,
} as const;

const Root = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  cursor: pointer;
  transition:
    color 0.15s ease,
    box-shadow 0.15s ease;
  ${({ $appearance }) => stateStyles[$appearance].enabled}
  & [data-slot='icon'] {
    ${({ $appearance }) => iconStateStyles[$appearance].enabled}
  }

  &:focus-visible {
    outline: none;
    ${({ $appearance }) => stateStyles[$appearance].focus}
    & [data-slot='icon'] {
      ${({ $appearance }) => iconStateStyles[$appearance].focus}
    }
  }

  &:hover:enabled {
    ${({ $appearance }) => stateStyles[$appearance].hover}
    & [data-slot='icon'] {
      ${({ $appearance }) => iconStateStyles[$appearance].hover}
    }
  }

  &:active:enabled {
    ${({ $appearance }) => stateStyles[$appearance].active}
    & [data-slot='icon'] {
      ${({ $appearance }) => iconStateStyles[$appearance].active}
    }
  }

  ${({ $loading }) =>
    $loading &&
    css`
      gap: ${({ theme }) => theme.spacing.inner.noGap};
      pointer-events: none;
    `}

  ${({ $state }) => ($state !== 'enabled' ? forcedStateStyles[$state] : null)}
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const ICON_SIZE = 24 as const;

export const ButtonLink = ({
  appearance = 'primary',
  state = 'enabled',
  loading = false,
  iconBefore = false,
  iconAfter = false,
  text = 'Link Label',
  disabled,
  type = 'button',
  ...rest
}: ButtonLinkProps) => {
  const isDisabled = Boolean(disabled || loading || state === 'disabled');
  const resolvedState: ButtonLinkState = isDisabled ? 'disabled' : state;

  return (
    <Root
      type={type}
      $appearance={appearance}
      $state={loading ? 'enabled' : resolvedState}
      $loading={loading}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={ICON_SIZE} />
      ) : (
        <>
          {iconBefore ? (
            <IconSlot data-slot="icon">
              <Icon icon={linkIconGlyph} size={ICON_SIZE} aria-hidden="true" />
            </IconSlot>
          ) : null}
          <span>{text}</span>
          {iconAfter ? (
            <IconSlot data-slot="icon">
              <Icon icon={linkIconGlyph} size={ICON_SIZE} aria-hidden="true" />
            </IconSlot>
          ) : null}
        </>
      )}
    </Root>
  );
};
