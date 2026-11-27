import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { Multiselect } from './Multiselect';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

describe('Multiselect', () => {
  it('renders combobox and opens list', () => {
    render(
      <ThemeProvider theme={theme}>
        <Multiselect label="Tags" options={OPTIONS} placeholder="Pick" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('toggles selection and calls onValueChange', () => {
    const onValueChange = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Multiselect label="Q" options={OPTIONS} placeholder="Pick" onValueChange={onValueChange} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Alpha'));
    expect(onValueChange).toHaveBeenLastCalledWith(['a']);

    fireEvent.click(screen.getByText('Beta'));
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);
  });

  it('clears all via clear button when there is a selection', () => {
    const onClear = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Multiselect label="Q" options={OPTIONS} defaultValue={['a']} onClear={onClear} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear all selections' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
