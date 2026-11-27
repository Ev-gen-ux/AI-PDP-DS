import { type ButtonHTMLAttributes } from 'react';
import { styled, css } from 'styled-components';
import { Icon, metaIconGlyph } from '@/components/icon';

export type SidebarNavigationItemState = 'enabled' | 'hover' | 'active';

export interface SidebarNavigationItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  state?: SidebarNavigationItemState;
  label?: boolean;
  labelText?: string;
}

type StyledProps = {
  $state: SidebarNavigationItemState;
};

const appearanceStyles = {
  enabled: css`
    background-color: ${({ theme }) => theme.colors.sidebarNavigationItem.background.enabled};
    color: ${({ theme }) => theme.colors.sidebarNavigationItem.label.enabled};
  `,
  hover: css`
    background-color: ${({ theme }) => theme.colors.sidebarNavigationItem.background.hover};
    color: ${({ theme }) => theme.colors.sidebarNavigationItem.label.hover};
  `,
  active: css`
    background-color: ${({ theme }) => theme.colors.sidebarNavigationItem.background.active};
    color: ${({ theme }) => theme.colors.sidebarNavigationItem.label.active};
  `,
} as const;

const Root = styled.button<StyledProps>`
  width: fit-content;
  height: ${({ theme }) => theme.spacing.height.large};
  box-sizing: border-box;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  padding: ${({ theme }) => theme.spacing.paddings.compactMedium};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  text-align: left;
  cursor: pointer;
  ${({ $state }) => appearanceStyles[$state]}

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }
`;

const IconWrap = styled.span<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $state }) => theme.colors.sidebarNavigationItem.icon[$state]};
`;

const LabelText = styled.span<StyledProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  font-weight: ${({ theme, $state }) =>
    $state === 'active'
      ? theme.typography.fontWeight.semiBold
      : theme.typography.fontWeight.regular};
  color: ${({ theme, $state }) => theme.colors.sidebarNavigationItem.label[$state]};
`;

const ICON_SIZE = 24 as const;

export const SidebarNavigationItem = ({
  state = 'enabled',
  label = true,
  labelText = 'Nav Label',
  type = 'button',
  ...rest
}: SidebarNavigationItemProps) => {
  const iconNode = <Icon icon={metaIconGlyph} size={ICON_SIZE} aria-hidden="true" />;
  const isActive = state === 'active';

  return (
    <Root type={type} $state={state} aria-current={isActive ? 'page' : undefined} {...rest}>
      {iconNode ? <IconWrap $state={state}>{iconNode}</IconWrap> : null}
      {label ? <LabelText $state={state}>{labelText}</LabelText> : null}
    </Root>
  );
};
