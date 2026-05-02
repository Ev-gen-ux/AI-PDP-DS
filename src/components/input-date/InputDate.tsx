import {
  type ChangeEvent,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { Icon, calendarBlankIconGlyph } from '../icon/Icon';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

export interface InputDateProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'placeholder'
> {
  label?: string;
  value?: string;
  defaultValue?: string;
  /** Визуальная подсказка при пустом значении (например «дд.мм.гггг»). */
  placeholder?: string;
  invalid?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

type FieldState = 'enabled' | 'hover' | 'focus' | 'disabled' | 'error';

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
  disabled: css`
    border-color: ${({ theme }) => theme.colors.input.border.disabled};
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.input.border.error};
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
  padding: 0 ${({ theme }) => theme.spacing.paddings.default};
  background-color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.input.background.disabled
      : theme.colors.input.background.enabled};
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
  ${({ $state }) => stateStyles[$state]}
`;

const InputShell = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
`;

const PlaceholderOverlay = styled.span<{ $disabled: boolean }>`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.input.textPlaceholder.disabled
      : theme.colors.input.textPlaceholder.enabled};
`;

const NativeDate = styled.input<{ $hasValue: boolean; $disabled: boolean }>`
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
  color: ${({ theme, $hasValue, $disabled }) => {
    if (!$hasValue) return 'transparent';
    return $disabled
      ? theme.colors.input.textPlaceholder.disabled
      : theme.colors.input.textPlaceholderValue.enabled;
  }};
  caret-color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.input.textPlaceholder.disabled
      : theme.colors.input.textPlaceholder.enabled};

  &::-webkit-calendar-picker-indicator {
    display: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const CalendarButton = styled.button<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: transparent;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.input.textPlaceholder.disabled : theme.colors.input.icon.enabled};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.colors.input.border.focus};
    outline-offset: 1px;
  }
`;

const resolveState = (params: {
  disabled: boolean;
  invalid: boolean;
  focused: boolean;
  hovered: boolean;
}): FieldState => {
  const { disabled, invalid, focused, hovered } = params;

  if (disabled) return 'disabled';
  if (invalid) return 'error';
  if (focused) return 'focus';
  if (hovered) return 'hover';
  return 'enabled';
};

export const InputDate = ({
  id,
  name,
  label = 'Label',
  value,
  defaultValue = '',
  placeholder = 'дд.мм.гггг',
  required = false,
  disabled = false,
  invalid = false,
  helpMessage,
  errorMessage,
  onChange,
  ...rest
}: InputDateProps) => {
  const reactId = useId();
  const inputId = id ?? `input-date-${reactId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value ?? '') : uncontrolledValue;
  const hasValue = currentValue.length > 0;

  const state = useMemo(
    () =>
      resolveState({
        disabled,
        invalid,
        focused,
        hovered,
      }),
    [disabled, invalid, focused, hovered],
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

  const openPicker = () => {
    if (disabled) return;
    const el = inputRef.current;
    el?.showPicker?.();
    el?.focus();
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
      >
        <InputShell>
          {!hasValue ? (
            <PlaceholderOverlay $disabled={disabled} aria-hidden="true">
              {placeholder}
            </PlaceholderOverlay>
          ) : null}
          <NativeDate
            {...rest}
            id={inputId}
            name={name}
            ref={inputRef}
            type="date"
            disabled={disabled}
            required={required}
            value={currentValue}
            onChange={handleChange}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            $hasValue={hasValue}
            $disabled={disabled}
          />
        </InputShell>
        <CalendarButton
          type="button"
          $disabled={disabled}
          disabled={disabled}
          aria-label="Open date picker"
          onClick={openPicker}
        >
          <Icon icon={calendarBlankIconGlyph} size={24} />
        </CalendarButton>
      </Field>
      {hasErrorMessage ? (
        <InlineMessage id={messageId} message={errorMessage as string} status="error" />
      ) : null}
      {hasHelpMessage ? <InlineMessage id={messageId} message={helpMessage as string} /> : null}
    </Root>
  );
};
