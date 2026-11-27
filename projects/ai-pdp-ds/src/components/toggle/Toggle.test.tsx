import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders with label and help message', () => {
    render(
      <ThemeProvider theme={theme}>
        <Toggle label="Toggle label" helpMessage="Help message" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('switch', { name: /Toggle label/ })).toBeInTheDocument();
    expect(screen.getByText('Help message')).toBeInTheDocument();
  });

  it('renders error message when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <Toggle
          label="Toggle label"
          invalid
          errorMessage="Error message"
          helpMessage="Help message"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Help message')).not.toBeInTheDocument();
  });

  it('toggles in uncontrolled mode', () => {
    render(
      <ThemeProvider theme={theme}>
        <Toggle label="Toggle label" />
      </ThemeProvider>,
    );

    const sw = screen.getByRole('switch') as HTMLInputElement;
    expect(sw.checked).toBe(false);

    fireEvent.click(sw);
    expect(sw.checked).toBe(true);

    fireEvent.click(sw);
    expect(sw.checked).toBe(false);
  });

  it('is disabled when disabled', () => {
    render(
      <ThemeProvider theme={theme}>
        <Toggle label="Toggle label" disabled />
      </ThemeProvider>,
    );

    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('toggles when clicking label', () => {
    render(
      <ThemeProvider theme={theme}>
        <Toggle label="Toggle label" helpMessage="Help message" />
      </ThemeProvider>,
    );

    const sw = screen.getByRole('switch') as HTMLInputElement;
    expect(sw.checked).toBe(false);

    fireEvent.click(screen.getByText('Toggle label'));
    expect(sw.checked).toBe(true);

    fireEvent.click(screen.getByText('Help message'));
    expect(sw.checked).toBe(false);
  });
});
