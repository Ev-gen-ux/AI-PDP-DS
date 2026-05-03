import {
  type ChangeEvent,
  type ChangeEventHandler,
  type ComponentType,
  type InputHTMLAttributes,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import styled, { css } from 'styled-components';
import { Icon, inputTelLeadingIconGlyph, xIconGlyph } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

type GlyphComponent = ComponentType<PhosphorIconProps>;

export interface InputTelProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
> {
  label?: string;
  value?: string;
  defaultValue?: string;
  invalid?: boolean;
  /** Валидное заполненное поле — рамка `inputTel.border.success` (макет InputTel). */
  success?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  /** Иконка слева; по умолчанию телефон из макета InputTel */
  leadingIcon?: GlyphComponent;
}

type FieldState = 'enabled' | 'hover' | 'focus' | 'readOnly' | 'disabled' | 'error' | 'success';

type FieldStyledProps = {
  $state: FieldState;
};

const borderWidthForState = ($state: FieldState): string => {
  if ($state === 'readOnly') return '1px';
  if ($state === 'disabled' || $state === 'error' || $state === 'focus') return '2px';
  return '1px';
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compact};
  width: 100%;
`;

const stateStyles = {
  enabled: css`
    border-color: ${({ theme }) => theme.colors.inputTel.border.enabled};
  `,
  hover: css`
    border-color: ${({ theme }) => theme.colors.inputTel.border.hover};
  `,
  focus: css`
    border-color: ${({ theme }) => theme.colors.inputTel.border.focus};
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  `,
  readOnly: css`
    border-color: transparent;
    background-color: transparent;
    padding: 0;
    min-height: auto;
  `,
  disabled: css`
    border-color: ${({ theme }) => theme.colors.inputTel.border.disabled};
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.inputTel.border.error};
  `,
  success: css`
    border-color: ${({ theme }) => theme.colors.inputTel.border.success};
  `,
} as const;

const Field = styled.div<FieldStyledProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-height: ${({ theme }) => theme.spacing.height.large};
  border-style: solid;
  border-width: ${({ $state }) => borderWidthForState($state)};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  padding: 0 ${({ theme }) => theme.spacing.paddings.default};
  box-sizing: border-box;
  background-color: ${({ theme, $state }) => {
    if ($state === 'readOnly') return 'transparent';
    if ($state === 'disabled') return theme.colors.inputTel.background.disabled;
    return theme.colors.inputTel.background.enabled;
  }};
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
  ${({ $state }) => stateStyles[$state]}
`;

const LeadIconWrap = styled.span<{ $disabled: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.inputTel.icon.disabled : theme.colors.inputTel.icon.enabled};
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
      ? theme.colors.inputTel.textPlaceholderValue.enabled
      : theme.colors.inputTel.textPlaceholder.enabled};

  &::placeholder {
    color: ${({ theme, $disabled }) =>
      $disabled
        ? theme.colors.inputTel.textPlaceholder.disabled
        : theme.colors.inputTel.textPlaceholder.enabled};
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
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
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

export const InputTel = ({
  id,
  name,
  label = 'Label',
  value,
  defaultValue = '',
  placeholder = '+1 (555) 000-0000',
  required = false,
  disabled = false,
  readOnly = false,
  invalid = false,
  success = false,
  helpMessage,
  errorMessage,
  onChange,
  onClear,
  leadingIcon,
  ...rest
}: InputTelProps) => {
  const reactId = useId();
  const inputId = id ?? `input-tel-${reactId}`;
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

  const Glyph = leadingIcon ?? inputTelLeadingIconGlyph;

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
        <LeadIconWrap $disabled={disabled} aria-hidden>
          <Icon icon={Glyph} size={24} />
        </LeadIconWrap>
        <NativeInput
          {...rest}
          id={inputId}
          name={name}
          ref={inputRef}
          type="tel"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          value={currentValue}
          onChange={handleChange}
          autoComplete="tel"
          aria-invalid={invalid || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={describedBy}
          $hasValue={hasValue}
          $disabled={disabled}
        />
        {!disabled && !readOnly && hasValue ? (
          <ClearButton type="button" aria-label="Clear phone number" onClick={handleClear}>
            <Icon icon={xIconGlyph} size={16} />
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
