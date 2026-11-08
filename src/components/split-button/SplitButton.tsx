import { type ButtonHTMLAttributes, type ReactNode, useState } from 'react';
import { styled, css } from 'styled-components';
import { Icon, caretDownIconGlyph, caretUpIconGlyph } from '@/components/icon';
import { Spinner } from '@/components/spinner';

export type SplitButtonAppearance = 'primary' | 'secondary';
export type SplitButtonState = 'enabled' | 'hover' | 'active' | 'loading' | 'disabled';

export interface SplitButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'children'
> {
  appearance?: SplitButtonAppearance;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  buttonState?: SplitButtonState;
  splitState?: SplitButtonState;
  menuOpen?: boolean;
  onButtonClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  onMenuToggle?: (nextOpen: boolean) => void;
  dropdownContent?: ReactNode;
}

type SegmentStyledProps = {
  $appearance: SplitButtonAppearance;
  $state: SplitButtonState;
};

const buttonStateStyles = {
  primary: {
    enabled: css`
      background-color: ${({ theme }) =>
        theme.colors.splitButton.primary.button.background.enabled};
      color: ${({ theme }) => theme.colors.splitButton.primary.button.label.enabled};
      border-color: transparent;
    `,
    hover: css`
      background-color: ${({ theme }) => theme.colors.splitButton.primary.button.background.hover};
      color: ${({ theme }) => theme.colors.splitButton.primary.button.label.enabled};
      border-color: transparent;
    `,
    active: css`
      background-color: ${({ theme }) => theme.colors.splitButton.primary.button.background.active};
      color: ${({ theme }) => theme.colors.splitButton.primary.button.label.enabled};
      border-color: transparent;
    `,
    loading: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.primary.button.icon.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.primary.button.border.disabled};
    `,
    disabled: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.primary.button.label.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.primary.button.border.disabled};
    `,
  },
  secondary: {
    enabled: css`
      background-color: ${({ theme }) =>
        theme.colors.splitButton.secondary.button.background.enabled};
      color: ${({ theme }) => theme.colors.splitButton.secondary.button.label.enabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.button.border.enabled};
    `,
    hover: css`
      background-color: ${({ theme }) =>
        theme.colors.splitButton.secondary.button.background.hover};
      color: ${({ theme }) => theme.colors.splitButton.secondary.button.label.enabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.button.border.enabled};
    `,
    active: css`
      background-color: ${({ theme }) =>
        theme.colors.splitButton.secondary.button.background.active};
      color: ${({ theme }) => theme.colors.splitButton.secondary.button.label.enabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.button.border.enabled};
    `,
    loading: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.secondary.button.icon.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.button.border.disabled};
    `,
    disabled: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.secondary.button.label.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.button.border.disabled};
    `,
  },
} as const;

const splitStateStyles = {
  primary: {
    enabled: css`
      background-color: ${({ theme }) => theme.colors.splitButton.primary.split.background.enabled};
      color: ${({ theme }) => theme.colors.splitButton.primary.split.icon.enabled};
      border-color: transparent;
    `,
    hover: css`
      background-color: ${({ theme }) => theme.colors.splitButton.primary.split.background.hover};
      color: ${({ theme }) => theme.colors.splitButton.primary.split.icon.enabled};
      border-color: transparent;
    `,
    active: css`
      background-color: ${({ theme }) => theme.colors.splitButton.primary.split.background.active};
      color: ${({ theme }) => theme.colors.splitButton.primary.split.icon.enabled};
      border-color: transparent;
    `,
    loading: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.primary.split.icon.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.primary.split.border.disabled};
    `,
    disabled: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.primary.split.icon.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.primary.split.border.disabled};
    `,
  },
  secondary: {
    enabled: css`
      background-color: ${({ theme }) =>
        theme.colors.splitButton.secondary.split.background.enabled};
      color: ${({ theme }) => theme.colors.splitButton.secondary.split.icon.enabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.split.border.enabled};
    `,
    hover: css`
      background-color: ${({ theme }) => theme.colors.splitButton.secondary.split.background.hover};
      color: ${({ theme }) => theme.colors.splitButton.secondary.split.icon.enabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.split.border.enabled};
    `,
    active: css`
      background-color: ${({ theme }) =>
        theme.colors.splitButton.secondary.split.background.active};
      color: ${({ theme }) => theme.colors.splitButton.secondary.split.icon.enabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.split.border.enabled};
    `,
    loading: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.secondary.split.icon.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.split.border.disabled};
    `,
    disabled: css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.splitButton.secondary.split.icon.disabled};
      border-color: ${({ theme }) => theme.colors.splitButton.secondary.split.border.disabled};
    `,
  },
} as const;

const Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ButtonsWrap = styled.div<{ $appearance: SplitButtonAppearance; $isDisabledPair: boolean }>`
  display: inline-flex;
  align-items: center;
  ${({ theme, $appearance, $isDisabledPair }) =>
    $appearance === 'primary' && !$isDisabledPair
      ? css`
          gap: ${theme.spacing.inner.xsClosest};
        `
      : css`
          gap: 0;
        `}
`;

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ActionButton = styled(BaseButton)<SegmentStyledProps>`
  position: relative;
  min-height: ${({ theme }) => theme.spacing.height.small};
  padding: ${({ theme }) => theme.spacing.paddings.xsCompact}
    ${({ theme }) => theme.spacing.paddings.compactMedium};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase} 0 0
    ${({ theme }) => theme.borderRadius.componentBase};
  ${({ $appearance }) =>
    $appearance === 'secondary'
      ? css`
          border-right-width: 0;
        `
      : null}
  ${({ $appearance, $state }) => buttonStateStyles[$appearance][$state]}

  ${({ $state, $appearance }) =>
    $state === 'enabled'
      ? css`
          &:hover:enabled {
            ${buttonStateStyles[$appearance].hover}
          }

          &:active:enabled {
            ${buttonStateStyles[$appearance].active}
          }
        `
      : null}

  ${({ $appearance }) =>
    $appearance === 'secondary'
      ? css`
          /* Keep separator on split side only. */
          border-right: 0 !important;
        `
      : null}

  ${({ $appearance, $state }) =>
    $appearance === 'primary' && ($state === 'loading' || $state === 'disabled')
      ? css`
          border-right-width: 0;
        `
      : null}
`;

const SplitTrigger = styled(BaseButton)<SegmentStyledProps>`
  position: relative;
  width: ${({ theme }) => theme.spacing.height.small};
  min-height: ${({ theme }) => theme.spacing.height.small};
  padding: ${({ theme }) => theme.spacing.paddings.compact};
  border-radius: 0 ${({ theme }) => theme.borderRadius.componentBase}
    ${({ theme }) => theme.borderRadius.componentBase} 0;
  ${({ theme, $appearance, $state }) =>
    $appearance === 'secondary'
      ? css`
          border-left-width: 0;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: -1px;
            bottom: -1px;
            width: 1px;
            background-color: ${$state === 'disabled' || $state === 'loading'
              ? theme.colors.splitButton.secondary.split.border.disabled
              : theme.colors.splitButton.secondary.split.border.enabled};
          }
        `
      : null}
  ${({ $appearance, $state }) => splitStateStyles[$appearance][$state]}

  ${({ $state, $appearance }) =>
    $state === 'enabled'
      ? css`
          &:hover:enabled {
            ${splitStateStyles[$appearance].hover}
          }

          &:active:enabled {
            ${splitStateStyles[$appearance].active}
          }
        `
      : null}
`;

const DropdownWrap = styled.div`
  margin-top: 4px;
  z-index: 1;
`;

const LoadingOverlay = styled.span`
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ICON_SIZE = 16 as const;

const resolveState = (
  explicitState: SplitButtonState,
  loading: boolean,
  disabled: boolean,
): SplitButtonState => {
  if (loading) return 'loading';
  if (disabled) return 'disabled';
  return explicitState;
};

export const SplitButton = ({
  appearance = 'primary',
  text = 'Button Label',
  loading = false,
  disabled = false,
  buttonState = 'enabled',
  splitState = 'enabled',
  menuOpen,
  onButtonClick,
  onMenuToggle,
  dropdownContent,
  type = 'button',
  ...rest
}: SplitButtonProps) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuControlled = menuOpen !== undefined;
  const isMenuOpen = isMenuControlled ? menuOpen : internalMenuOpen;
  const resolvedButtonState = resolveState(buttonState, loading, disabled);
  const resolvedSplitState = resolveState(splitState, loading, disabled);
  const isDisabledPair = resolvedButtonState === 'disabled' || resolvedButtonState === 'loading';
  const showUpIcon = isMenuOpen || resolvedSplitState === 'active';
  const toggleMenu = (nextOpen: boolean) => {
    if (!isMenuControlled) {
      setInternalMenuOpen(nextOpen);
    }
    onMenuToggle?.(nextOpen);
  };
  const handleMainButtonClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] = (event) => {
    onButtonClick?.(event);
    toggleMenu(!isMenuOpen);
  };

  return (
    <Root>
      <ButtonsWrap $appearance={appearance} $isDisabledPair={isDisabledPair}>
        <ActionButton
          type={type}
          $appearance={appearance}
          $state={resolvedButtonState}
          disabled={isDisabledPair}
          onClick={handleMainButtonClick}
          aria-busy={loading || undefined}
          aria-disabled={isDisabledPair || undefined}
          {...rest}
        >
          <span style={{ visibility: resolvedButtonState === 'loading' ? 'hidden' : 'visible' }}>
            {text}
          </span>
          {resolvedButtonState === 'loading' ? (
            <LoadingOverlay>
              <Spinner size={ICON_SIZE} />
            </LoadingOverlay>
          ) : null}
        </ActionButton>

        <SplitTrigger
          type="button"
          $appearance={appearance}
          $state={resolvedSplitState}
          disabled={isDisabledPair}
          onClick={() => toggleMenu(!isMenuOpen)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen || undefined}
          aria-label="Toggle dropdown"
        >
          <Icon
            icon={showUpIcon ? caretUpIconGlyph : caretDownIconGlyph}
            size={ICON_SIZE}
            aria-hidden="true"
          />
        </SplitTrigger>
      </ButtonsWrap>

      {isMenuOpen && dropdownContent ? <DropdownWrap>{dropdownContent}</DropdownWrap> : null}
    </Root>
  );
};
