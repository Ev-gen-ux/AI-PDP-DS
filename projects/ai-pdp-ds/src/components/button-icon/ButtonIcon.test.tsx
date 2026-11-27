import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { ButtonIcon } from './ButtonIcon';

describe('ButtonIcon', () => {
  it('renders as button', () => {
    render(
      <ThemeProvider theme={theme}>
        <ButtonIcon />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('sets disabled while loading', () => {
    render(
      <ThemeProvider theme={theme}>
        <ButtonIcon loading />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
