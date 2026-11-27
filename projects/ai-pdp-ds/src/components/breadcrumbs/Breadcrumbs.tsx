import { type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { styled, css } from 'styled-components';
import { Icon, dotsThreeIconGlyph } from '@/components/icon';

export type BreadcrumbsItemState = 'enabled' | 'hover' | 'active' | 'current';
export type BreadcrumbsMoreState = 'default' | 'hover' | 'active';

type BreadcrumbsBaseNode = {
  key?: string;
};

export type BreadcrumbsItemNode = BreadcrumbsBaseNode & {
  type: 'item';
  label: string;
  state?: BreadcrumbsItemState;
  current?: boolean;
  disabled?: boolean;
};

export type BreadcrumbsMoreNode = BreadcrumbsBaseNode & {
  type: 'more';
  state?: BreadcrumbsMoreState;
  disabled?: boolean;
};

export type BreadcrumbsNode = BreadcrumbsItemNode | BreadcrumbsMoreNode;

export interface BreadcrumbsProps extends Omit<
  ButtonHTMLAttributes<HTMLElement>,
  'onClick' | 'children'
> {
  items?: BreadcrumbsNode[];
  onItemClick?: (
    index: number,
    node: BreadcrumbsNode,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
}

type BreadcrumbsItemButtonProps = {
  $state: Exclude<BreadcrumbsItemState, 'current'>;
};

type MoreButtonProps = {
  $state: BreadcrumbsMoreState;
};

const defaultItems: BreadcrumbsNode[] = [
  { type: 'item', label: 'root' },
  { type: 'item', label: 'parent' },
  { type: 'item', label: 'parent' },
  { type: 'more' },
  { type: 'item', label: 'current', current: true, state: 'current', disabled: true },
];

const itemBackgroundStateStyles = {
  enabled: css``,
  hover: css`
    background-color: ${({ theme }) => theme.colors.breadcrumbs.item.background.calm.hover};
  `,
  active: css`
    background-color: ${({ theme }) => theme.colors.breadcrumbs.item.background.calm.active};
  `,
} as const;

const itemLabelStateStyles = {
  enabled: css`
    color: ${({ theme }) => theme.colors.breadcrumbs.item.label.loud.enabled};
  `,
  hover: css`
    color: ${({ theme }) => theme.colors.breadcrumbs.item.label.loud.hover};
  `,
  active: css`
    color: ${({ theme }) => theme.colors.breadcrumbs.item.label.loud.active};
  `,
  current: css`
    color: ${({ theme }) => theme.colors.breadcrumbs.item.label.loud.current};
  `,
} as const;

const moreBackgroundStateStyles = {
  default: css``,
  hover: css`
    background-color: ${({ theme }) => theme.colors.breadcrumbs.buttonMore.calm.hover};
  `,
  active: css`
    background-color: ${({ theme }) => theme.colors.breadcrumbs.buttonMore.calm.active};
  `,
} as const;

const Root = styled.nav`
  display: inline-flex;
  align-items: center;
`;

const List = styled.ol`
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
  list-style: none;
`;

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
`;

const Divider = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.inner.closest};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  color: ${({ theme }) => theme.colors.breadcrumbs.item.divider.calm.enabled};
`;

const BreadcrumbsItemButton = styled.button<BreadcrumbsItemButtonProps>`
  border: 0;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  padding: ${({ theme }) => theme.spacing.paddings.xxsCompact};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  ${({ $state }) => itemBackgroundStateStyles[$state]}
  ${({ $state }) => itemLabelStateStyles[$state]}

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  ${({ $state }) =>
    $state === 'enabled'
      ? css`
          &:hover:enabled {
            ${itemBackgroundStateStyles.hover}
            ${itemLabelStateStyles.hover}
          }
          &:active:enabled {
            ${itemBackgroundStateStyles.active}
            ${itemLabelStateStyles.active}
          }
        `
      : null}

  &:disabled {
    cursor: default;
  }
`;

const BreadcrumbsItemCurrent = styled.span`
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  padding: ${({ theme }) => theme.spacing.paddings.xxsCompact};
  ${itemLabelStateStyles.current}
`;

const ItemLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  white-space: nowrap;
`;

const MoreButton = styled.button<MoreButtonProps>`
  border: 0;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  padding: ${({ theme }) => theme.spacing.inner.closest};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease;
  color: ${({ theme }) => theme.colors.breadcrumbs.icon.calm.enabled};
  ${({ $state }) => moreBackgroundStateStyles[$state]}

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  ${({ $state }) =>
    $state === 'default'
      ? css`
          &:hover:enabled {
            ${moreBackgroundStateStyles.hover}
          }
          &:active:enabled {
            ${moreBackgroundStateStyles.active}
          }
        `
      : null}
`;

export const Breadcrumbs = ({ items = defaultItems, onItemClick, ...rest }: BreadcrumbsProps) => {
  const handleItemClick = (
    index: number,
    node: BreadcrumbsNode,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    onItemClick?.(index, node, event);
  };

  return (
    <Root aria-label="Breadcrumbs" {...rest}>
      <List>
        {items.map((node, index) => {
          const key = node.key ?? `${node.type}-${index}`;
          const hasDivider = index < items.length - 1;

          return (
            <ListItem key={key}>
              {node.type === 'item' ? (
                node.current || node.state === 'current' ? (
                  <BreadcrumbsItemCurrent aria-current="page">
                    <ItemLabel>{node.label}</ItemLabel>
                  </BreadcrumbsItemCurrent>
                ) : (
                  <BreadcrumbsItemButton
                    type="button"
                    $state={node.state ?? 'enabled'}
                    disabled={node.disabled}
                    onClick={(event) => handleItemClick(index, node, event)}
                  >
                    <ItemLabel>{node.label}</ItemLabel>
                  </BreadcrumbsItemButton>
                )
              ) : (
                <MoreButton
                  type="button"
                  $state={node.state ?? 'default'}
                  disabled={node.disabled}
                  aria-label="Show more breadcrumbs"
                  onClick={(event) => handleItemClick(index, node, event)}
                >
                  <Icon icon={dotsThreeIconGlyph} size={16} aria-hidden="true" />
                </MoreButton>
              )}
              {hasDivider ? <Divider>/</Divider> : null}
            </ListItem>
          );
        })}
      </List>
    </Root>
  );
};
