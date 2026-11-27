import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { Divider } from './Divider';

const wrap = (ui: ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;

describe('Divider', () => {
  it('renders with separator role and horizontal orientation by default', () => {
    render(wrap(<Divider data-testid="div" />));
    const el = screen.getByTestId('div');
    expect(el).toHaveAttribute('role', 'separator');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('sets aria-orientation vertical when orientation is vertical', () => {
    render(wrap(<Divider orientation="vertical" data-testid="div" />));
    expect(screen.getByTestId('div')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('allows overriding aria-orientation', () => {
    render(
      wrap(<Divider orientation="horizontal" aria-orientation="vertical" data-testid="div" />),
    );
    expect(screen.getByTestId('div')).toHaveAttribute('aria-orientation', 'vertical');
  });
});
