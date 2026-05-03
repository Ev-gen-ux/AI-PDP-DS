import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { ProgressBar } from './ProgressBar';

const wrap = (ui: ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;

describe('ProgressBar', () => {
  it('exposes progressbar semantics with default scale 0–100', () => {
    render(wrap(<ProgressBar value={35} data-testid="pb" />));
    const el = screen.getByTestId('pb');
    expect(el).toHaveAttribute('role', 'progressbar');
    expect(el).toHaveAttribute('aria-valuemin', '0');
    expect(el).toHaveAttribute('aria-valuemax', '100');
    expect(el).toHaveAttribute('aria-valuenow', '35');
    expect(el).toHaveAttribute('aria-label', 'Progress');
  });

  it('clamps value to max and min', () => {
    render(wrap(<ProgressBar value={150} max={100} data-testid="pb" />));
    expect(screen.getByTestId('pb')).toHaveAttribute('aria-valuenow', '100');
    render(wrap(<ProgressBar value={-10} data-testid="pb2" />));
    expect(screen.getByTestId('pb2')).toHaveAttribute('aria-valuenow', '0');
  });

  it('uses custom max for aria-valuemax and valuenow', () => {
    render(wrap(<ProgressBar value={2} max={5} data-testid="pb" />));
    const el = screen.getByTestId('pb');
    expect(el).toHaveAttribute('aria-valuemax', '5');
    expect(el).toHaveAttribute('aria-valuenow', '2');
  });

  it('treats non-positive max as 100 for scale', () => {
    render(wrap(<ProgressBar value={30} max={0} data-testid="pb" />));
    const el = screen.getByTestId('pb');
    expect(el).toHaveAttribute('aria-valuemax', '100');
    expect(el).toHaveAttribute('aria-valuenow', '30');
  });

  it('renders horizontal indeterminate without aria-valuenow and with aria-busy', () => {
    render(wrap(<ProgressBar indeterminate aria-label="Loading" data-testid="pb" />));
    const el = screen.getByTestId('pb');
    expect(el.tagName.toLowerCase()).toBe('div');
    expect(el).toHaveAttribute('role', 'progressbar');
    expect(el).not.toHaveAttribute('aria-valuenow');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });
});
