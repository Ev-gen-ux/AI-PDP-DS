import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders with label and help message', () => {
    render(
      <ThemeProvider theme={theme}>
        <Radio label="Radio label" helpMessage="Help message" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Radio label')).toBeInTheDocument();
    expect(screen.getByText('Help message')).toBeInTheDocument();
  });

  it('renders error message when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <Radio
          label="Radio label"
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
        <Radio label="Radio label" />
      </ThemeProvider>,
    );

    const radio = screen.getByLabelText('Radio label') as HTMLInputElement;
    expect(radio.checked).toBe(false);

    fireEvent.click(radio);
    expect(radio.checked).toBe(true);

    fireEvent.click(radio);
    expect(radio.checked).toBe(false);
  });

  it('is disabled in disabled state', () => {
    render(
      <ThemeProvider theme={theme}>
        <Radio label="Radio label" disabled />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Radio label')).toBeDisabled();
  });

  it('still toggles when checked prop is provided without onChange', () => {
    render(
      <ThemeProvider theme={theme}>
        <Radio label="Radio label" checked={false} />
      </ThemeProvider>,
    );

    const radio = screen.getByLabelText('Radio label') as HTMLInputElement;
    expect(radio.checked).toBe(false);

    fireEvent.click(radio);
    expect(radio.checked).toBe(true);
  });

  it('toggles when clicking text area (label/help message)', () => {
    render(
      <ThemeProvider theme={theme}>
        <Radio label="Radio label" helpMessage="Help message" />
      </ThemeProvider>,
    );

    const radio = screen.getByRole('radio') as HTMLInputElement;
    expect(radio.checked).toBe(false);

    fireEvent.click(screen.getByText('Radio label'));
    expect(radio.checked).toBe(true);

    fireEvent.click(screen.getByText('Help message'));
    expect(radio.checked).toBe(false);
  });
});
