import { styled, css } from 'styled-components';
import { ButtonIcon } from '@/components/button-icon';
import { buildPaginationItems } from './paginationItems';

export type { PaginationItem } from './paginationItems';
export { buildPaginationItems } from './paginationItems';

export interface PaginationProps {
  /** Текущая страница (1 … pageCount). */
  page: number;
  /** Число страниц. */
  pageCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

const Root = styled.nav`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.close};
`;

const pageCellCurrentStyles = css`
  background-color: ${({ theme }) => theme.colors.button.icon.primary.background.active};

  &:enabled:hover,
  &:enabled:active {
    background-color: ${({ theme }) => theme.colors.button.icon.primary.background.active};
  }
`;

const pageCellDefaultStyles = css`
  &:enabled {
    background-color: ${({ theme }) => theme.colors.button.icon.primary.background.enabled};
  }

  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.button.icon.primary.background.hover};
  }

  &:active:enabled {
    background-color: ${({ theme }) => theme.colors.button.icon.primary.background.active};
  }
`;

type PageCellProps = { $isCurrent: boolean };

const PageCell = styled.button<PageCellProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ theme }) => theme.spacing.height.small};
  height: ${({ theme }) => theme.spacing.height.small};
  padding: ${({ theme }) => theme.spacing.paddings.compact};
  margin: 0;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.button.icon.primary.icon.enabled};
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.button.icon.primary.icon.disabled};
    background-color: ${({ theme }) => theme.colors.button.icon.primary.background.enabled};
  }

  ${({ $isCurrent }) => ($isCurrent ? pageCellCurrentStyles : pageCellDefaultStyles)}

  ${({ $isCurrent }) =>
    $isCurrent &&
    css`
      &:disabled {
        background-color: ${({ theme }) => theme.colors.button.icon.primary.background.active};
      }
    `}
`;

const Ellipsis = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ theme }) => theme.spacing.height.small};
  height: ${({ theme }) => theme.spacing.height.small};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.button.icon.primary.icon.enabled};
  user-select: none;
`;

export const Pagination = ({
  page,
  pageCount,
  onPageChange,
  disabled = false,
  className,
  id,
  'aria-label': ariaLabel = 'Pagination',
}: PaginationProps) => {
  if (pageCount < 1) {
    return null;
  }

  const safePage = Math.min(Math.max(1, page), pageCount);
  const items = buildPaginationItems(safePage, pageCount);

  return (
    <Root id={id} className={className} aria-label={ariaLabel}>
      <ButtonIcon
        appearance="secondary"
        size="small"
        icon="caret-double-left"
        type="button"
        disabled={disabled || safePage <= 1}
        aria-label="First page"
        onClick={() => onPageChange(1)}
      />
      {items.map((item) => {
        if (item.type === 'ellipsis') {
          return (
            <Ellipsis key={item.id} aria-hidden="true">
              …
            </Ellipsis>
          );
        }

        const pageNumber = item.page;
        const current = pageNumber === safePage;

        return (
          <PageCell
            key={pageNumber}
            type="button"
            $isCurrent={current}
            disabled={disabled}
            aria-label={`Page ${pageNumber}`}
            aria-current={current ? 'page' : undefined}
            onClick={() => {
              if (pageNumber !== safePage) {
                onPageChange(pageNumber);
              }
            }}
          >
            {pageNumber}
          </PageCell>
        );
      })}
      <ButtonIcon
        appearance="secondary"
        size="small"
        icon="caret-double-right"
        type="button"
        disabled={disabled || safePage >= pageCount}
        aria-label="Last page"
        onClick={() => onPageChange(pageCount)}
      />
    </Root>
  );
};
