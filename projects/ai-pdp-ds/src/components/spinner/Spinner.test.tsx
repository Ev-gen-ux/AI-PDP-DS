import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';
import { theme } from '@/theme/tokens';

describe('Spinner', () => {
  it('renders with status role', () => {
    render(
      <ThemeProvider theme={theme}>
        <Spinner />
      </ThemeProvider>,
    );

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('renders svg indicator for large size', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Spinner size={40} />
      </ThemeProvider>,
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
  });
});
