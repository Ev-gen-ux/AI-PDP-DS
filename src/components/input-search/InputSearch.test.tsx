import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { InputSearch } from './InputSearch';
import { theme } from '@/theme/tokens';

describe('InputSearch', () => {
  it('renders search input and label', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputSearch label="Search" placeholder="Type to search" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type to search')).toHaveAttribute('type', 'search');
  });

  it('shows clear button when value is non-empty', () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <InputSearch label="Q" defaultValue="" />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <InputSearch label="Q" value="x" onChange={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('calls onClear when clear is clicked', () => {
    const onClear = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <InputSearch label="Q" defaultValue="term" onClear={onClear} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('sets aria-invalid when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputSearch label="Q" invalid defaultValue="bad" />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('Q')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message instead of help when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputSearch label="Q" invalid helpMessage="Help" errorMessage="Error" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });
});
