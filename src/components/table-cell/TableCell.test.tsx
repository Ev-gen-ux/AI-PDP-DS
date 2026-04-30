import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { TableCellEmptyState } from './empty-state';
import { TableCellInlineEdit } from './inline-edit';

describe('TableCell', () => {
  it('renders empty state text', () => {
    render(
      <ThemeProvider theme={theme}>
        <TableCellEmptyState text="---" />
      </ThemeProvider>,
    );

    expect(screen.getByText('---')).toBeInTheDocument();
  });

  it('renders inline edit text', () => {
    render(
      <ThemeProvider theme={theme}>
        <TableCellInlineEdit defaultValue="textContent" />
      </ThemeProvider>,
    );

    expect(screen.getByText('textContent')).toBeInTheDocument();
  });

  it('switches to edit mode on double click and commits on Enter', () => {
    render(
      <ThemeProvider theme={theme}>
        <TableCellInlineEdit defaultValue="textContent" />
      </ThemeProvider>,
    );

    const trigger = screen.getByRole('button');
    fireEvent.doubleClick(trigger);

    const input = screen.getByRole('textbox', { name: 'Inline edit value' });
    fireEvent.change(input, { target: { value: 'updated' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('updated')).toBeInTheDocument();
  });
});
