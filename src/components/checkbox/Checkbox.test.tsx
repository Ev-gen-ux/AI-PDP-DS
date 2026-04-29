import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label and help message', () => {
    render(
      <ThemeProvider theme={theme}>
        <Checkbox label="Checkbox label" helpMessage="Help message" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Checkbox label')).toBeInTheDocument();
    expect(screen.getByText('Help message')).toBeInTheDocument();
  });

  it('renders error message when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <Checkbox
          label="Checkbox label"
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
        <Checkbox label="Checkbox label" />
      </ThemeProvider>,
    );

    const checkbox = screen.getByLabelText('Checkbox label') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('is disabled in disabled state', () => {
    render(
      <ThemeProvider theme={theme}>
        <Checkbox label="Checkbox label" disabled />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Checkbox label')).toBeDisabled();
  });

  it('toggles when clicking text area', () => {
    render(
      <ThemeProvider theme={theme}>
        <Checkbox label="Checkbox label" helpMessage="Help message" />
      </ThemeProvider>,
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(screen.getByText('Checkbox label'));
    expect(checkbox.checked).toBe(true);

    fireEvent.click(screen.getByText('Help message'));
    expect(checkbox.checked).toBe(false);
  });
});
