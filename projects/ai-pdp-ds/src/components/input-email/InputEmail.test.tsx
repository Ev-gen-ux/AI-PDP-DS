import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { InputEmail } from './InputEmail';
import { theme } from '@/theme/tokens';

describe('InputEmail', () => {
  it('renders email input and label', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputEmail label="Email" placeholder="you@example.com" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toHaveAttribute('type', 'email');
  });

  it('shows clear button when value is non-empty', () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <InputEmail label="E" defaultValue="" />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Clear email' })).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <InputEmail label="E" value="a@b.co" onChange={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Clear email' })).toBeInTheDocument();
  });

  it('calls onClear when clear is clicked', () => {
    const onClear = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <InputEmail label="E" defaultValue="x@y.z" onClear={onClear} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear email' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('sets aria-invalid when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputEmail label="E" invalid defaultValue="bad" />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('E')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message instead of help when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputEmail label="E" invalid helpMessage="Help" errorMessage="Error" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });
});
