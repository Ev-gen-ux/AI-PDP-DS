import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { Chips } from './Chips';

describe('Chips', () => {
  it('renders default label', () => {
    render(
      <ThemeProvider theme={theme}>
        <Chips />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Chips Label' })).toBeInTheDocument();
  });

  it('calls onClick when enabled', () => {
    const onClick = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Chips onClick={onClick} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Chips Label' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
