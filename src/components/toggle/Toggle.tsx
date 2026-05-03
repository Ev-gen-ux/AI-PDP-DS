import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type MouseEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

export type ToggleState = 'enabled' | 'focus' | 'disabled';

export interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'role'
> {
  label?: string;
  invalid?: boolean;
  inlineMessage?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  state?: ToggleState;
}

type VisualState = 'enabled' | 'focus' | 'disabled';

const Root = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.related};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const ControlColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  box-sizing: border-box;
  width: ${({ theme }) => theme.spacing.toggle.trackWidth};
  padding: ${({ theme }) => `${theme.spacing.inner.closest} 0`};
`;

const NativeInput = styled.input`
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: inherit;
  z-index: 1;
`;

const Track = styled.span<{
  $checked: boolean;
  $disabled: boolean;
  $showFocus: boolean;
}>`
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(
    ${({ theme }) => theme.spacing.height['2xSmall']} +
      ${({ theme }) => theme.spacing.inner.closest} +
      ${({ theme }) => theme.spacing.inner.closest} +
      ${({ theme }) => theme.spacing.inner.xsClosest} +
      ${({ theme }) => theme.spacing.inner.xsClosest}
  );
  padding: ${({ theme }) => theme.spacing.inner.closest};
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  border: 1px solid transparent;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ theme, $disabled, $checked }) => {
    if ($disabled) {
      return css`
        background-color: ${theme.colors.toggle.backgroundMark.enabled};
        border-color: ${theme.colors.toggle.border.loud.disabled};
      `;
    }
    if ($checked) {
      return css`
        background-color: ${theme.colors.toggle.backgroundMark.active};
      `;
    }
    return css`
      background-color: ${theme.colors.toggle.backgroundMark.enabled};
    `;
  }}

  ${({ theme, $showFocus, $disabled }) =>
    !$disabled &&
    $showFocus &&
    css`
      box-shadow: 0px 0px 0px 2px ${theme.colors.focus.ring.default};
    `}
`;

const Thumb = styled.span<{ $checked: boolean; $disabled: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.inner.closest};
  bottom: ${({ theme }) => theme.spacing.inner.closest};
  width: ${({ theme }) => theme.spacing.height['2xSmall']};
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  transition:
    left 0.15s ease,
    background-color 0.15s ease;

  ${({ theme, $disabled, $checked }) => {
    const thumb = theme.spacing.height['2xSmall'];
    const inset = theme.spacing.inner.closest;
    if ($disabled) {
      return css`
        left: ${inset};
        background-color: ${theme.colors.toggle.mark.disabled};
        ${$checked &&
        css`
          left: calc(100% - ${thumb} - ${inset});
        `}
      `;
    }
    if ($checked) {
      return css`
        left: calc(100% - ${thumb} - ${inset});
        background-color: ${theme.colors.toggle.mark.active};
      `;
    }
    return css`
      left: ${inset};
      background-color: ${theme.colors.toggle.mark.enabled};
    `;
  }}
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
  state: ToggleState;
}): VisualState => {
  const { disabled, focused, state } = params;
  if (disabled || state === 'disabled') return 'disabled';
  if (focused || state === 'focus') return 'focus';
  return 'enabled';
};

export const Toggle = ({
  id,
  name,
  label,
  required = false,
  disabled = false,
  invalid = false,
  checked,
  defaultChecked = false,
  inlineMessage,
  helpMessage,
  errorMessage,
  state = 'enabled',
  onChange,
  ...rest
}: ToggleProps) => {
  const reactId = useId();
  const inputId = id ?? `toggle-${reactId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusVisible, setFocusVisible] = useState(false);
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? Boolean(checked) : uncontrolledChecked;
  const isDisabled = disabled || state === 'disabled';
  const visualState = useMemo(
    () => resolveVisualState({ disabled: isDisabled, focused: focusVisible, state }),
    [focusVisible, isDisabled, state],
  );

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

  const showFocusRing = visualState === 'focus';

  return (
    <Root $disabled={isDisabled} onClick={handleRootClick}>
      <ControlColumn>
        <NativeInput
          {...rest}
          id={inputId}
          name={name}
          ref={inputRef}
          type="checkbox"
          role="switch"
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
        <Track aria-hidden $checked={isChecked} $disabled={isDisabled} $showFocus={showFocusRing}>
          <Thumb $checked={isChecked} $disabled={isDisabled} />
        </Track>
      </ControlColumn>

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
