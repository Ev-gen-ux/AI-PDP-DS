import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { StatusLabel } from './StatusLabel';

describe('StatusLabel', () => {
  it('renders status text', () => {
    render(
      <ThemeProvider theme={theme}>
        <StatusLabel text="Success label" status="success" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Success label')).toBeInTheDocument();
  });

  it('can hide icon', () => {
    render(
      <ThemeProvider theme={theme}>
        <StatusLabel text="No icon" withIcon={false} />
      </ThemeProvider>,
    );

    const status = screen.getByRole('status');
    expect(status.querySelector('svg')).toBeNull();
  });
});
