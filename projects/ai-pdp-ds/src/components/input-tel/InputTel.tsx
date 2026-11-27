import {
  type ChangeEvent,
  type ChangeEventHandler,
  type ComponentType,
  type InputHTMLAttributes,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { styled, css } from 'styled-components';
import { Icon, inputTelLeadingIconGlyph, xIconGlyph } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';
import {
  INPUT_TEL_COUNTRY_PREFIX,
  INPUT_TEL_MASK_PLACEHOLDER,
  formatNationalTelMask,
  parseNationalTelDigits,
} from './inputTelMask';

type GlyphComponent = ComponentType<PhosphorIconProps>;

export interface InputTelProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'inputMode' | 'maxLength'
> {
  label?: string;
  /** 0–10 национальных цифр (без +7). В `onChange` в `event.target.value` — только цифры. */
  value?: string;
  /** Начальные цифры (0–10), не отформатированная строка. */
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
  /**
   * Плейсхолдер маски национальной части; по умолчанию `(999) 999 99 99` из
   * [макета](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-29557).
   */
  placeholder?: string;
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

const NationalBlock = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-width: 0;
`;

const CountryPrefix = styled.span<{ $disabled: boolean }>`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.inputTel.prefix.disabled : theme.colors.inputTel.prefix.enabled};
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
  caret-color: ${({ theme }) => theme.colors.inputTel.cursor.enabled};
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
  color: ${({ theme }) => theme.colors.inputTel.icon.enabled};
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

const patchChangeNationalDigits = (
  event: ChangeEvent<HTMLInputElement>,
  nationalDigits: string,
): ChangeEvent<HTMLInputElement> => {
  const t = event.target;
  const nextTarget = { ...t, value: nationalDigits } as EventTarget & HTMLInputElement;
  return {
    ...event,
    target: nextTarget,
    currentTarget: nextTarget,
  } as ChangeEvent<HTMLInputElement>;
};

export const InputTel = ({
  id,
  name,
  label = 'Label',
  value,
  defaultValue = '',
  placeholder = INPUT_TEL_MASK_PLACEHOLDER,
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
  const [uncontrolledDigits, setUncontrolledDigits] = useState(() =>
    parseNationalTelDigits(defaultValue),
  );
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isControlled = value !== undefined;
  const currentDigits = isControlled ? parseNationalTelDigits(value) : uncontrolledDigits;
  const displayValue = useMemo(() => formatNationalTelMask(currentDigits), [currentDigits]);
  const hasValue = currentDigits.length > 0;

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el || document.activeElement !== el) return;
    const len = displayValue.length;
    el.setSelectionRange(len, len);
  }, [displayValue]);

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
    const digits = parseNationalTelDigits(event.target.value);
    if (!isControlled) {
      setUncontrolledDigits(digits);
    }
    onChange?.(patchChangeNationalDigits(event, digits));
  };

  const handleClear = () => {
    if (!isControlled) {
      setUncontrolledDigits('');
    }
    onClear?.();
    const el = inputRef.current;
    if (onChange && el) {
      const base = { target: el, currentTarget: el } as ChangeEvent<HTMLInputElement>;
      onChange(patchChangeNationalDigits(base, ''));
    }
    el?.focus();
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
        <NationalBlock>
          <CountryPrefix $disabled={disabled} aria-hidden="true">
            {INPUT_TEL_COUNTRY_PREFIX}
          </CountryPrefix>
          <NativeInput
            {...rest}
            id={inputId}
            name={name}
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            value={displayValue}
            onChange={handleChange}
            aria-invalid={invalid || undefined}
            aria-readonly={readOnly || undefined}
            aria-describedby={describedBy}
            $hasValue={hasValue}
            $disabled={disabled}
          />
        </NationalBlock>
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
