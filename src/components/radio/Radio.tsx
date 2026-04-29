import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type MouseEvent,
  useRef,
  useId,
  useMemo,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

export type RadioState = 'enabled' | 'focus' | 'disabled';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  invalid?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  state?: RadioState;
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
  $invalid: boolean;
  $visualState: VisualState;
}>`
  display: block;
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ theme, $checked, $invalid, $visualState }) => {
    if ($visualState === 'disabled') {
      return css`
        background-color: ${theme.colors.radioButton.background.disabled};
        border: 1px solid transparent;
        cursor: not-allowed;
      `;
    }

    if ($checked) {
      return css`
        background-color: ${$invalid
          ? theme.colors.radioButton.background.error
          : theme.colors.radioButton.background.checked};
        border: 1px solid transparent;
      `;
    }

    return css`
      background-color: ${theme.colors.radioButton.background.enabled};
      border: 1px solid
        ${$invalid
          ? theme.colors.radioButton.border.error
          : theme.colors.radioButton.border.enabled};
    `;
  }}

  ${({ theme, $visualState }) =>
    $visualState === 'focus' &&
    css`
      box-shadow: 0px 0px 0px 2px ${theme.colors.focus.ring.default};
    `}

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: ${({ theme }) => theme.borderRadius.rounded};
    transform: translate(-50%, -50%);
    opacity: ${({ $checked }) => ($checked ? 1 : 0)};
    background-color: ${({ theme, $visualState }) =>
      $visualState === 'disabled'
        ? theme.colors.radioButton.controlMark.disabled
        : theme.colors.radioButton.controlMark.active};
    transition: opacity 0.15s ease;
  }
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
  state: RadioState;
}): VisualState => {
  const { disabled, focused, state } = params;
  if (disabled || state === 'disabled') return 'disabled';
  if (focused || state === 'focus') return 'focus';
  return 'enabled';
};

export const Radio = ({
  id,
  name,
  label,
  required = false,
  disabled = false,
  invalid = false,
  checked,
  defaultChecked = false,
  helpMessage,
  errorMessage,
  state = 'enabled',
  onChange,
  ...rest
}: RadioProps) => {
  const reactId = useId();
  const inputId = id ?? `radio-${reactId}`;
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

  const messageId = `${inputId}-message`;
  const hasErrorMessage = invalid && Boolean(errorMessage);
  const hasHelpMessage = !hasErrorMessage && Boolean(helpMessage);
  const describedBy = hasErrorMessage || hasHelpMessage ? messageId : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }
    onChange?.(event);
  };

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    if (isChecked) {
      event.preventDefault();
      if (!isControlled) {
        setUncontrolledChecked(false);
      }
    }
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
          type="radio"
          checked={isChecked}
          disabled={isDisabled}
          required={required}
          onChange={handleChange}
          onClick={handleClick}
          onFocus={(event) => {
            setFocusVisible(event.currentTarget.matches(':focus-visible'));
          }}
          onBlur={() => setFocusVisible(false)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
        <Control $checked={isChecked} $invalid={invalid} $visualState={visualState} />
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
        {hasHelpMessage ? <InlineMessage id={messageId} message={helpMessage as string} /> : null}
      </Content>
    </Root>
  );
};
