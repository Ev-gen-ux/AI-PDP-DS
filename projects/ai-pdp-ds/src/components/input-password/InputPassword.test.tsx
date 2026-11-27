import type { FormEvent, ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServerStyleSheet, ThemeProvider } from 'styled-components';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { InputPassword } from './InputPassword';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('InputPassword', () => {
  it('masks natively and toggles without changing the value or submitting a form', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const submit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <InputPassword defaultValue="Example123" onChange={change} />
      </form>,
      { wrapper },
    );
    const input = screen.getByLabelText(/^Password/) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
    act(() => input.focus());
    input.setSelectionRange(2, 5);
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('Example123');
    expect(input).toHaveFocus();
    expect([input.selectionStart, input.selectionEnd]).toEqual([2, 5]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveFocus();
    await user.keyboard(' ');
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(change).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });

  it('respects controlled value and visibility until the owner updates them', async () => {
    const user = userEvent.setup();
    const onVisibleChange = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <InputPassword
        value="abc"
        visible={false}
        onChange={onChange}
        onVisibleChange={onVisibleChange}
      />,
      { wrapper },
    );
    const input = screen.getByLabelText(/^Password/);
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.change(input, { target: { value: 'abcd' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(input).toHaveValue('abc');
    rerender(
      <InputPassword value="abcd" visible onChange={onChange} onVisibleChange={onVisibleChange} />,
    );
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('abcd');
  });

  it('merges error descriptions and preserves native input attributes', () => {
    const { rerender } = render(
      <InputPassword
        id="pw"
        name="password"
        required
        invalid
        errorMessage="Error"
        helpMessage="Help"
        aria-describedby="external"
        autoComplete="new-password"
      />,
      { wrapper },
    );
    const input = screen.getByLabelText(/^Password/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'external pw-message');
    expect(input).toHaveAttribute('name', 'password');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByText('Error')).toHaveAttribute('id', 'pw-message');
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    rerender(<InputPassword id="pw" helpMessage="" aria-describedby="external" />);
    expect(input).toHaveAttribute('aria-describedby', 'external');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  it('blocks input and reveal while disabled', async () => {
    const user = userEvent.setup();
    const onVisibleChange = vi.fn();
    render(<InputPassword disabled defaultValue="secret" onVisibleChange={onVisibleChange} />, {
      wrapper,
    });
    const input = screen.getByLabelText(/^Password/);
    expect(input).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
    await user.click(screen.getByRole('button'));
    await user.type(input, 'x');
    expect(input).toHaveValue('secret');
    expect(input).toHaveAttribute('type', 'password');
    expect(onVisibleChange).not.toHaveBeenCalled();
  });

  it('keeps native uncontrolled typing and form reset after revealing', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <InputPassword defaultValue="initial" defaultVisible />
      </form>,
      { wrapper },
    );
    const input = screen.getByLabelText(/^Password/);
    expect(input).toHaveAttribute('type', 'text');
    await user.clear(input);
    await user.type(input, 'replacement');
    expect(input).toHaveValue('replacement');
    (screen.getByTestId('form') as HTMLFormElement).reset();
    expect(input).toHaveValue('initial');
  });
  it('keeps body color ownership separate from native DS label and message', () => {
    const sheet = new ServerStyleSheet();
    try {
      renderToStaticMarkup(
        sheet.collectStyles(
          <ThemeProvider theme={theme}>
            <InputPassword required invalid errorMessage="Error" />
            <InputPassword disabled />
          </ThemeProvider>,
        ),
      );
      const css = sheet.getStyleTags();
      expect(css).toContain('var(--colors-inputPassword-background-enabled)');
      expect(css).toContain('var(--colors-inputPassword-border-error)');
      expect(css).toContain('var(--colors-inputPassword-icon-disabled)');
      expect(css).toContain('var(--colors-input-label-enabled)');
      expect(css).toContain('var(--colors-input-required-enabled)');
      expect(css).toContain('var(--colors-input-inlineMessage-error)');
      expect(css).toContain('var(--colors-inputPassword-cursor-enabled)');
      expect(css).not.toContain('--colors-inputText-');
      expect(css).not.toContain('--colors-inputPassword-label-');
      expect(css).not.toContain('--colors-inputPassword-required-');
      expect(css).not.toContain('--colors-inputPassword-_validationMessage-');
    } finally {
      sheet.seal();
    }
  });
});
