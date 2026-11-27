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

  it('resets the draft on controlled edit sessions and external value changes', () => {
    const view = (editing: boolean, value: string) => (
      <ThemeProvider theme={theme}>
        <TableCellInlineEdit editing={editing} value={value} />
      </ThemeProvider>
    );
    const { rerender } = render(view(true, 'original'));
    const editor = () => screen.getByRole('textbox', { name: 'Inline edit value' });
    expect(editor()).toHaveFocus();
    fireEvent.change(editor(), { target: { value: 'draft' } });
    expect(editor()).toHaveValue('draft');
    rerender(view(true, 'external'));
    expect(editor()).toHaveValue('external');
    fireEvent.change(editor(), { target: { value: 'another draft' } });
    rerender(view(false, 'external'));
    rerender(view(true, 'external'));
    expect(editor()).toHaveValue('external');
    expect(editor()).toHaveFocus();
    fireEvent.keyDown(editor(), { key: 'Escape' });
    expect(editor()).toHaveValue('external');
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
