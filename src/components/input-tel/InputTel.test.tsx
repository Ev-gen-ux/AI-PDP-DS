import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { InputTel } from './InputTel';
import { theme } from '@/theme/tokens';

describe('InputTel', () => {
  it('renders tel input and label', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputTel label="Phone" placeholder="+1 555 000 0000" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 555 000 0000')).toHaveAttribute('type', 'tel');
  });

  it('shows clear button when value is non-empty', () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <InputTel label="P" defaultValue="" />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Clear phone number' })).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <InputTel label="P" value="+15550001" onChange={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Clear phone number' })).toBeInTheDocument();
  });

  it('calls onClear when clear is clicked', () => {
    const onClear = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <InputTel label="P" defaultValue="+1" onClear={onClear} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear phone number' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('sets aria-invalid when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputTel label="P" invalid defaultValue="x" />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('P')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message instead of help when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputTel label="P" invalid helpMessage="Help" errorMessage="Error" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });
});
