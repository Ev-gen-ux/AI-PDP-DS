import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { Counter, counterLayoutBucket, formatCounterValue } from './Counter';

const wrap = (ui: ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;

describe('formatCounterValue', () => {
  it('formats thresholds and clamps negatives', () => {
    expect(formatCounterValue(0)).toBe('0');
    expect(formatCounterValue(9)).toBe('9');
    expect(formatCounterValue(99)).toBe('99');
    expect(formatCounterValue(100)).toBe('99+');
    expect(formatCounterValue(999)).toBe('99+');
    expect(formatCounterValue(1000)).toBe('999+');
    expect(formatCounterValue(-3)).toBe('0');
    expect(formatCounterValue(Number.NaN)).toBe('0');
  });
});

describe('counterLayoutBucket', () => {
  it('maps label length to layout bucket', () => {
    expect(counterLayoutBucket('0')).toBe('single');
    expect(counterLayoutBucket('10')).toBe('double');
    expect(counterLayoutBucket('99+')).toBe('overflow99');
    expect(counterLayoutBucket('999+')).toBe('overflow999');
  });
});

describe('Counter', () => {
  it('renders formatted value', () => {
    render(wrap(<Counter value={42} />));
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders overflow label', () => {
    render(wrap(<Counter value={5000} />));
    expect(screen.getByText('999+')).toBeInTheDocument();
  });
});
