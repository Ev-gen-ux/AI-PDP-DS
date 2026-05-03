import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { INPUT_TEL_COUNTRY_PREFIX, INPUT_TEL_MASK_PLACEHOLDER } from './inputTelMask';
import { InputTel } from './InputTel';
import { theme } from '@/theme/tokens';

describe('InputTel', () => {
  it('renders fixed country prefix and mask placeholder', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputTel label="Phone" />
      </ThemeProvider>,
    );

    expect(screen.getByText(INPUT_TEL_COUNTRY_PREFIX)).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'tel');
    expect(screen.getByPlaceholderText(INPUT_TEL_MASK_PLACEHOLDER)).toBeInTheDocument();
  });

  it('shows clear button when national digits are non-empty', () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <InputTel label="P" defaultValue="" />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Clear phone number' })).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <InputTel label="P" value="9123456789" onChange={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Clear phone number' })).toBeInTheDocument();
    expect(screen.getByLabelText('P')).toHaveValue('(912) 345 67 89');
  });

  it('onChange receives at most 10 national digits', () => {
    const onChange = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <InputTel label="P" onChange={onChange} />
      </ThemeProvider>,
    );
    const input = screen.getByLabelText('P');
    fireEvent.change(input, { target: { value: '(912) 345-67-89-00-11' } });
    expect(onChange).toHaveBeenCalled();
    const first = onChange.mock.calls[0]?.[0];
    expect(first?.target.value).toBe('9123456789');
  });

  it('calls onClear when clear is clicked', () => {
    const onClear = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <InputTel label="P" defaultValue="9" onClear={onClear} />
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
