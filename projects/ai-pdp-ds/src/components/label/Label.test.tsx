import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';
import { theme } from '@/theme/tokens';

describe('Label', () => {
  it('renders label text', () => {
    render(
      <ThemeProvider theme={theme}>
        <Label text="Name" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders required marker', () => {
    render(
      <ThemeProvider theme={theme}>
        <Label text="Name" required />
      </ThemeProvider>,
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
