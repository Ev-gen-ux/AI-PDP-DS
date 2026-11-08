import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type MouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { styled, css } from 'styled-components';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

export type CheckboxState = 'enabled' | 'focus' | 'disabled';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: string;
  invalid?: boolean;
  indeterminate?: boolean;
  inlineMessage?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  state?: CheckboxState;
}

type VisualState = 'enabled' | 'focus' | 'disabled';

const Root = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.related};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const ControlHitArea = styled.div`
  position: relative;
  display: inline-flex;
  width: 20px;
  height: 24px;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2px;
  cursor: pointer;
`;

const NativeInput = styled.input`
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: inherit;
`;

const Control = styled.span<{
  $checked: boolean;
  $indeterminate: boolean;
  $invalid: boolean;
  $visualState: VisualState;
}>`
  display: block;
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ theme, $checked, $indeterminate, $invalid, $visualState }) => {
    if ($visualState === 'disabled') {
      return css`
        background-color: ${theme.colors.checkbox.background.disabled};
        border: 1px solid transparent;
        cursor: not-allowed;
      `;
    }

    if ($checked || $indeterminate) {
      return css`
        background-color: ${$invalid
          ? theme.colors.checkbox.background.error
          : theme.colors.checkbox.background.checked};
        border: 1px solid transparent;
      `;
    }

    return css`
      background-color: ${theme.colors.checkbox.background.enabled};
      border: 1px solid
        ${$invalid ? theme.colors.checkbox.border.error : theme.colors.checkbox.border.enabled};
    `;
  }}

  ${({ theme, $visualState }) =>
    $visualState === 'focus' &&
    css`
      box-shadow: 0px 0px 0px 2px ${theme.colors.focus.ring.default};
    `}
`;

const CheckMark = styled.svg<{ $disabled: boolean }>`
  position: absolute;
  inset: 0;
  width: 20px;
  height: 20px;
  transform: translate(-1px, -1px);
  pointer-events: none;
  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.checkbox.controlMark.disabled
      : theme.colors.checkbox.controlMark.enabled};
`;

const IndeterminateMark = styled.span<{ $disabled: boolean }>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 2px;
  border-radius: 1px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  background-color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.checkbox.controlMark.disabled
      : theme.colors.checkbox.controlMark.enabled};
`;

const Content = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.close};

  label,
  div {
    cursor: inherit;
  }
`;

const resolveVisualState = (params: {
  disabled: boolean;
  focused: boolean;
  state: CheckboxState;
}): VisualState => {
  const { disabled, focused, state } = params;
  if (disabled || state === 'disabled') return 'disabled';
  if (focused || state === 'focus') return 'focus';
  return 'enabled';
};

export const Checkbox = ({
  id,
  name,
  label,
  required = false,
  disabled = false,
  invalid = false,
  checked,
  defaultChecked = false,
  indeterminate = false,
  inlineMessage,
  helpMessage,
  errorMessage,
  state = 'enabled',
  onChange,
  ...rest
}: CheckboxProps) => {
  const reactId = useId();
  const inputId = id ?? `checkbox-${reactId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusVisible, setFocusVisible] = useState(false);
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined && typeof onChange === 'function';
  const isChecked = isControlled ? checked : uncontrolledChecked;
  const isDisabled = disabled || state === 'disabled';
  const visualState = useMemo(
    () => resolveVisualState({ disabled: isDisabled, focused: focusVisible, state }),
    [focusVisible, isDisabled, state],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !isChecked;
    }
  }, [indeterminate, isChecked]);

  const messageId = `${inputId}-message`;
  const hasErrorMessage = invalid && Boolean(errorMessage);
  const hasHelpMessage = !hasErrorMessage && (inlineMessage ?? Boolean(helpMessage));
  const helpMessageText = helpMessage ?? 'Help message';
  const describedBy = hasErrorMessage || hasHelpMessage ? messageId : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }
    onChange?.(event);
  };

  const handleRootClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    if (event.target === inputRef.current) return;
    if ((event.target as HTMLElement).closest('label')) return;
    inputRef.current?.click();
  };

  return (
    <Root $disabled={isDisabled} onClick={handleRootClick}>
      <ControlHitArea>
        <NativeInput
          {...rest}
          id={inputId}
          name={name}
          ref={inputRef}
          type="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          required={required}
          onChange={handleChange}
          onFocus={(event) => {
            setFocusVisible(event.currentTarget.matches(':focus-visible'));
          }}
          onBlur={() => setFocusVisible(false)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <Control
          $checked={isChecked}
          $indeterminate={indeterminate && !isChecked}
          $invalid={invalid}
          $visualState={visualState}
        >
          {isChecked ? (
            <CheckMark
              $disabled={visualState === 'disabled'}
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 10.5L9.5 13L14 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </CheckMark>
          ) : null}
          {indeterminate && !isChecked ? (
            <IndeterminateMark $disabled={visualState === 'disabled'} aria-hidden="true" />
          ) : null}
        </Control>
      </ControlHitArea>

      <Content>
        {label ? (
          <Label
            htmlFor={inputId}
            text={label}
            required={required}
            state={isDisabled ? 'disabled' : 'default'}
          />
        ) : null}
        {hasErrorMessage ? (
          <InlineMessage id={messageId} message={errorMessage as string} status="error" />
        ) : null}
        {hasHelpMessage ? <InlineMessage id={messageId} message={helpMessageText} /> : null}
      </Content>
    </Root>
  );
};
