import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { InputText } from './InputText';
import { theme } from '@/theme/tokens';

describe('InputText', () => {
  it('renders input and label', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputText label="Username" placeholder="Enter username" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('shows clear button only when value exists', () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <InputText label="Name" defaultValue="" />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <InputText label="Name" value="Alex" onChange={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
  });

  it('calls onClear when clear button clicked', () => {
    const onClear = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <InputText label="Name" defaultValue="Alex" onClear={onClear} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('sets aria-invalid when invalid is true', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputText label="Email" invalid defaultValue="wrong-email" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message and hides help message when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputText label="Email" invalid helpMessage="Help message" errorMessage="Error message" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Help message')).not.toBeInTheDocument();
  });
});
