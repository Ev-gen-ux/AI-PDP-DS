import {
  type ChangeEvent,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { X } from '@phosphor-icons/react';
import styled, { css } from 'styled-components';
import { Icon } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

export interface InputTextProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
> {
  label?: string;
  value?: string;
  defaultValue?: string;
  invalid?: boolean;
  success?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
}

type FieldState = 'enabled' | 'hover' | 'focus' | 'readOnly' | 'disabled' | 'error' | 'success';

type FieldProps = {
  $state: FieldState;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compact};
  width: 100%;
`;

const stateStyles = {
  enabled: css`
    border-color: ${({ theme }) => theme.colors.input.border.enabled};
  `,
  hover: css`
    border-color: ${({ theme }) => theme.colors.input.border.hover};
  `,
  focus: css`
    border-color: ${({ theme }) => theme.colors.input.border.focus};
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  `,
  readOnly: css`
    border-color: transparent;
    background-color: transparent;
    padding: 0;
    min-height: auto;
  `,
  disabled: css`
    border-color: ${({ theme }) => theme.colors.input.border.disabled};
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.input.border.error};
  `,
  success: css`
    border-color: ${({ theme }) => theme.colors.input.border.success};
  `,
} as const;

const Field = styled.div<FieldProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-height: ${({ theme }) => theme.spacing.height.large};
  border-width: 1px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  padding: 0 16px;
  background-color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.input.background.disabled
      : theme.colors.input.background.enabled};
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
  ${({ $state }) => stateStyles[$state]}
`;

const NativeInput = styled.input<{ $hasValue: boolean; $disabled: boolean }>`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme, $hasValue }) =>
    $hasValue
      ? theme.colors.input.textPlaceholderValue.enabled
      : theme.colors.input.textPlaceholder.enabled};

  &::placeholder {
    color: ${({ theme, $disabled }) =>
      $disabled
        ? theme.colors.input.textPlaceholder.disabled
        : theme.colors.input.textPlaceholder.enabled};
  }

  &:read-only {
    cursor: text;
    user-select: text;
  }
`;

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: transparent;
  color: ${({ theme }) => theme.colors.input.icon.enabled};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.colors.input.border.focus};
    outline-offset: 1px;
  }
`;

const resolveState = (params: {
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  success: boolean;
  focused: boolean;
  hovered: boolean;
}): FieldState => {
  const { disabled, readOnly, invalid, success, focused, hovered } = params;

  if (disabled) return 'disabled';
  if (readOnly) return 'readOnly';
  if (invalid) return 'error';
  if (focused) return 'focus';
  if (hovered) return 'hover';
  if (success) return 'success';
  return 'enabled';
};

export const InputText = ({
  id,
  name,
  label = 'Label',
  value,
  defaultValue = '',
  placeholder = 'Placeholder',
  required = false,
  disabled = false,
  readOnly = false,
  invalid = false,
  success = false,
  helpMessage,
  errorMessage,
  onChange,
  onClear,
  ...rest
}: InputTextProps) => {
  const reactId = useId();
  const inputId = id ?? `input-text-${reactId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const hasValue = currentValue.length > 0;

  const state = useMemo(
    () =>
      resolveState({
        disabled,
        readOnly,
        invalid,
        success,
        focused,
        hovered,
      }),
    [disabled, readOnly, invalid, success, focused, hovered],
  );
  const messageId = `${inputId}-message`;
  const hasErrorMessage = invalid && Boolean(errorMessage);
  const hasHelpMessage = !hasErrorMessage && Boolean(helpMessage);
  const describedBy = hasErrorMessage || hasHelpMessage ? messageId : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = () => {
    if (!isControlled) {
      setUncontrolledValue('');
    }
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <Root>
      <Label
        htmlFor={inputId}
        text={label}
        required={required}
        state={disabled ? 'disabled' : readOnly ? 'readOnly' : 'default'}
      />
      <Field
        $state={state}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
      >
        <NativeInput
          {...rest}
          id={inputId}
          name={name}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          value={currentValue}
          onChange={handleChange}
          aria-invalid={invalid || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={describedBy}
          $hasValue={hasValue}
          $disabled={disabled}
        />
        {!disabled && !readOnly && hasValue ? (
          <ClearButton type="button" aria-label="Clear input" onClick={handleClear}>
            <Icon icon={X} size={16} />
          </ClearButton>
        ) : null}
      </Field>
      {hasErrorMessage ? (
        <InlineMessage id={messageId} message={errorMessage as string} status="error" />
      ) : null}
      {hasHelpMessage ? <InlineMessage id={messageId} message={helpMessage as string} /> : null}
    </Root>
  );
};
