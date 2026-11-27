import { type ChangeEventHandler, type InputHTMLAttributes, useId, useRef, useState } from 'react';
import { css, styled } from 'styled-components';
import { Icon, passwordHideIconGlyph, passwordShowIconGlyph } from '@/components/icon';
import { Label } from '@/components/label';
import { InlineMessage } from '@/components/inline-message';

export interface InputPasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
> {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  invalid?: boolean;
  /** Explicit validation success, matching Figma state=value. */
  success?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  /** Controlled password visibility. */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

type FieldState = 'enabled' | 'hover' | 'focus' | 'success' | 'error' | 'disabled';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compact};
  width: 100%;
  min-width: 0;
`;

const stateStyles = {
  enabled: css`
    border-color: ${({ theme }) => theme.colors.inputPassword.border.enabled};
  `,
  hover: css`
    border-color: ${({ theme }) => theme.colors.inputPassword.border.hover};
  `,
  focus: css`
    border-color: ${({ theme }) => theme.colors.inputPassword.border.focus};
  `,
  success: css`
    border-color: ${({ theme }) => theme.colors.inputPassword.border.success};
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.inputPassword.border.error};
  `,
  disabled: css`
    border-color: ${({ theme }) => theme.colors.inputPassword.border.disabled};
  `,
} satisfies Record<FieldState, ReturnType<typeof css>>;

const Field = styled.div<{ $state: FieldState; $focused: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  padding: ${({ theme }) => theme.spacing.paddings.default};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  box-sizing: border-box;
  background: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.inputPassword.background.disabled
      : theme.colors.inputPassword.background.enabled};
  ${({ theme, $focused, $state }) =>
    $focused &&
    $state !== 'disabled' &&
    css`
      box-shadow: 0 0 0 2px ${theme.colors.inputPassword.focus.ring};
    `}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-style: solid;
    border-width: ${({ $state }) =>
      ['focus', 'error', 'disabled'].includes($state) ? '2px' : '1px'};
    border-radius: inherit;
    box-sizing: border-box;
    pointer-events: none;
    ${({ $state }) => stateStyles[$state]}
  }
`;

const NativeInput = styled.input<{ $disabled: boolean }>`
  flex: 1;
  min-width: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
  color: ${({ theme }) => theme.colors.inputPassword.textPlaceholderValue.enabled};
  caret-color: ${({ theme }) => theme.colors.inputPassword.cursor.enabled};
  &::placeholder {
    opacity: 1;
    color: ${({ theme, $disabled }) =>
      $disabled
        ? theme.colors.inputPassword.textPlaceholder.disabled
        : theme.colors.inputPassword.textPlaceholder.enabled};
  }
  &::-ms-reveal {
    display: none;
  }
`;

// Figma base field -> 24px glyph. The transparent hit area does not affect layout.
const VisibilityButton = styled.button<{ $disabled: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: transparent;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.inputPassword.icon.disabled : theme.colors.inputPassword.icon.enabled};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  &::before {
    content: '';
    position: absolute;
    inset: -10px;
  }
  &:focus-visible {
    outline: none;
  }
`;

export const InputPassword = ({
  id,
  label = 'Password',
  value,
  defaultValue,
  onChange,
  placeholder = 'Enter password',
  autoComplete = 'current-password',
  required = false,
  disabled = false,
  invalid = false,
  success = false,
  helpMessage = 'Enter your password',
  errorMessage,
  visible,
  defaultVisible = false,
  onVisibleChange,
  'aria-describedby': externalDescribedBy,
  ...rest
}: InputPasswordProps) => {
  const generatedId = useId();
  const inputId = id ?? `input-password-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isVisible = visible ?? uncontrolledVisible;
  const state: FieldState = disabled
    ? 'disabled'
    : invalid
      ? 'error'
      : focused
        ? 'focus'
        : hovered
          ? 'hover'
          : success
            ? 'success'
            : 'enabled';
  const message = invalid && errorMessage ? errorMessage : helpMessage;
  const messageId = `${inputId}-message`;
  const describedBy =
    [externalDescribedBy, message ? messageId : undefined].filter(Boolean).join(' ') || undefined;

  const toggleVisibility = () => {
    const input = inputRef.current;
    const hadInputFocus = document.activeElement === input;
    const start = input?.selectionStart ?? null;
    const end = input?.selectionEnd ?? null;
    if (visible === undefined) setUncontrolledVisible(!isVisible);
    onVisibleChange?.(!isVisible);
    // Pointer activation retains the caret; keyboard activation retains button focus.
    if (hadInputFocus && input) {
      input.focus();
      if (start !== null && end !== null) input.setSelectionRange(start, end);
    }
  };

  return (
    <Root>
      <Label
        htmlFor={inputId}
        text={label}
        required={required}
        state={disabled ? 'disabled' : 'default'}
      />
      <Field
        $state={state}
        $focused={focused}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <NativeInput
          {...rest}
          id={inputId}
          ref={inputRef}
          type={isVisible ? 'text' : 'password'}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          $disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <VisibilityButton
          type="button"
          disabled={disabled}
          $disabled={disabled}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          aria-controls={inputId}
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggleVisibility}
        >
          <Icon
            icon={isVisible ? passwordHideIconGlyph : passwordShowIconGlyph}
            size={24}
            aria-hidden
          />
        </VisibilityButton>
      </Field>
      {message ? (
        <InlineMessage
          id={messageId}
          message={message}
          status={invalid && errorMessage ? 'error' : 'default'}
        />
      ) : null}
    </Root>
  );
};
