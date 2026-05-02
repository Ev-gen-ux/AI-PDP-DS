import type { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';
import { buildPaginationItems } from './paginationItems';
import { theme } from '@/theme/tokens';

const wrap = (ui: ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;

describe('buildPaginationItems', () => {
  it('returns all pages when pageCount <= 7', () => {
    expect(buildPaginationItems(2, 5)).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
    ]);
  });

  it('inserts ellipses for large pageCount', () => {
    expect(buildPaginationItems(5, 20)).toEqual([
      { type: 'page', page: 1 },
      { type: 'ellipsis', id: 'start' },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
      { type: 'page', page: 6 },
      { type: 'ellipsis', id: 'end' },
      { type: 'page', page: 20 },
    ]);
  });

  it('returns empty array when pageCount < 1', () => {
    expect(buildPaginationItems(1, 0)).toEqual([]);
  });
});

describe('Pagination', () => {
  it('renders nav and triggers onPageChange', () => {
    const onPageChange = vi.fn();
    render(
      wrap(
        <Pagination page={1} pageCount={3} onPageChange={onPageChange} aria-label="Test pages" />,
      ),
    );

    expect(screen.getByRole('navigation', { name: 'Test pages' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables first control on first page', () => {
    render(wrap(<Pagination page={1} pageCount={5} onPageChange={() => undefined} />));
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).not.toBeDisabled();
  });

  it('returns null when pageCount < 1', () => {
    const { container } = render(
      wrap(<Pagination page={1} pageCount={0} onPageChange={() => undefined} />),
    );
    expect(container.firstChild).toBeNull();
  });
});
