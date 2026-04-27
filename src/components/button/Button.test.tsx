import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { theme } from '@/theme/tokens';

describe('Button', () => {
  it('renders text content', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button text="Click me" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('marks busy state when loading', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button text="Submit" loading />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('aria-busy', 'true');
  });
});
