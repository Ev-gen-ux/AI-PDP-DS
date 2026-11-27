import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { Select } from './Select';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

describe('Select', () => {
  it('renders label and opens list on trigger click', () => {
    render(
      <ThemeProvider theme={theme}>
        <Select label="Country" options={OPTIONS} placeholder="Choose" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Country')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Country' }));
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('selects option and calls onValueChange', () => {
    const onValueChange = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <Select label="Q" options={OPTIONS} placeholder="Choose" onValueChange={onValueChange} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Q' }));
    fireEvent.click(screen.getByText('Beta'));
    expect(onValueChange).toHaveBeenCalledWith('b', OPTIONS[1]);
    expect(screen.getByRole('button', { name: 'Q' })).toHaveTextContent('Beta');
  });

  it('shows error message when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <Select label="Q" options={OPTIONS} invalid errorMessage="Bad" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Bad')).toBeInTheDocument();
  });
});
