import { isValidElement, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Icon, metaIconGlyph } from '@/components/icon';

export type DropdownItemState = 'enabled' | 'hover' | 'active' | 'disabled';

export interface DropdownItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> {
  label?: string;
  description?: boolean;
  descriptionText?: string;
  state?: DropdownItemState;
  disabled?: boolean;
  iconBefore?: ReactNode | boolean;
  onSelect?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

type StyledProps = {
  $state: DropdownItemState;
};

const stateStyles = {
  enabled: css`
    background-color: ${({ theme }) => theme.colors.dropdownList.item.background.enabled};
  `,
  hover: css`
    background-color: ${({ theme }) => theme.colors.dropdownList.item.background.hover};
  `,
  active: css`
    background-color: ${({ theme }) => theme.colors.dropdownList.item.background.active};
  `,
  disabled: css`
    background-color: ${({ theme }) => theme.colors.dropdownList.item.background.disabled};
  `,
} as const;

const Root = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.related};
  padding: ${({ theme }) => theme.spacing.paddings.xxsCompact}
    ${({ theme }) => theme.spacing.inner.close};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: transparent;
  text-align: left;
  cursor: pointer;
`;

const ItemShell = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.paddings.xxsCompact}
    ${({ theme }) => theme.spacing.paddings.xsCompact};
`;

const Content = styled.div`
  min-width: 0;
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
`;

const IconPaddingContainer = styled.span<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.inner.closest} 0;
  color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.dropdownList.item.icon.disabled
      : theme.colors.dropdownList.item.icon.enabled};

  /* Keep icon tied to explicit dropdown token variable. */
  & svg {
    color: ${({ theme, $state }) =>
      $state === 'disabled'
        ? theme.colors.dropdownList.item.icon.disabled
        : theme.colors.dropdownList.item.icon.enabled};
    fill: ${({ theme, $state }) =>
      $state === 'disabled'
        ? theme.colors.dropdownList.item.icon.disabled
        : theme.colors.dropdownList.item.icon.enabled};
  }
`;

const Label = styled.span<StyledProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  color: ${({ theme, $state }) =>
    $state === 'disabled' ? theme.colors.dropdownList.item.label.disabled : theme.colors.text.base};
`;

const Description = styled.span<StyledProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.component.extraSmall};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.extraSmall};
  color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.dropdownList.item.description.disabled
      : theme.colors.text.secondary};
`;

const Container = styled.div<StyledProps>`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  ${({ $state }) => stateStyles[$state]}

  ${({ $state }) =>
    $state === 'enabled'
      ? css`
          &:hover {
            ${stateStyles.hover}
          }
          &:active {
            ${stateStyles.active}
          }
        `
      : null}

  ${({ $state }) =>
    $state === 'disabled'
      ? css`
          ${Root} {
            cursor: not-allowed;
          }
        `
      : null}
`;

const ICON_SIZE = 16 as const;
const DROPDOWN_ITEM_ICON_ENABLED = 'var(--colors-dropdownList-item-icon-enabled)' as const;
const DROPDOWN_ITEM_ICON_DISABLED = 'var(--colors-dropdownList-item-icon-disabled)' as const;

export const DropdownItem = ({
  label = 'Label',
  description = true,
  descriptionText = 'Description',
  state = 'enabled',
  disabled,
  iconBefore,
  onSelect,
  type = 'button',
  ...rest
}: DropdownItemProps) => {
  const isDisabled = Boolean(disabled || state === 'disabled');
  const resolvedState: DropdownItemState = isDisabled ? 'disabled' : state;

  const resolveIcon = (
    iconProp: ReactNode | boolean | undefined,
    iconColor: typeof DROPDOWN_ITEM_ICON_ENABLED | typeof DROPDOWN_ITEM_ICON_DISABLED,
  ) => {
    if (iconProp === undefined || iconProp === null || iconProp === false) return null;
    if (iconProp === true) {
      return <Icon icon={metaIconGlyph} size={ICON_SIZE} color={iconColor} aria-hidden="true" />;
    }
    if (typeof iconProp === 'string' || typeof iconProp === 'number' || isValidElement(iconProp)) {
      return iconProp;
    }
    return <Icon icon={metaIconGlyph} size={ICON_SIZE} color={iconColor} aria-hidden="true" />;
  };

  const iconColor =
    resolvedState === 'disabled' ? DROPDOWN_ITEM_ICON_DISABLED : DROPDOWN_ITEM_ICON_ENABLED;
  const iconNode = resolveIcon(iconBefore, iconColor);

  return (
    <ItemShell>
      <Container $state={resolvedState}>
        <Root
          type={type}
          onClick={onSelect}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          {...rest}
        >
          {iconNode ? (
            <IconPaddingContainer $state={resolvedState}>{iconNode}</IconPaddingContainer>
          ) : null}
          <Content>
            <Label $state={resolvedState}>{label}</Label>
            {description ? (
              <Description $state={resolvedState}>{descriptionText}</Description>
            ) : null}
          </Content>
        </Root>
      </Container>
    </ItemShell>
  );
};
