import { type ButtonHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { DropdownList, type DropdownListOption } from '@/components/dropdown-list';
import { Icon, caretDownIconGlyph, caretUpIconGlyph } from '@/components/icon';

export type SelectButtonState = 'enabled' | 'hover' | 'active' | 'focus' | 'disabled';
export type SelectButtonSize = 'small (32px)' | 'extra small (24px)';

export interface SelectButtonOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  options?: SelectButtonOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option: SelectButtonOption) => void;
  placeholder?: string;
  size?: SelectButtonSize;
  state?: SelectButtonState;
}

type StyledProps = {
  $state: SelectButtonState;
  $size: SelectButtonSize;
};

const stateStyles = {
  enabled: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.dropdownButton.background.calm.enabled};
    color: ${({ theme }) => theme.colors.dropdownButton.label.calm.enabled};
  `,
  hover: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.dropdownButton.background.calm.hover};
    color: ${({ theme }) => theme.colors.dropdownButton.label.calm.enabled};
  `,
  active: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.dropdownButton.background.calm.active};
    color: ${({ theme }) => theme.colors.dropdownButton.label.calm.enabled};
  `,
  focus: css`
    border: 1px solid transparent;
    background-color: ${({ theme }) => theme.colors.dropdownButton.background.calm.enabled};
    color: ${({ theme }) => theme.colors.dropdownButton.label.calm.enabled};
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  `,
  disabled: css`
    border: 1px solid ${({ theme }) => theme.colors.dropdownButton.border.calm.disabled};
    background-color: transparent;
    color: ${({ theme }) => theme.colors.dropdownButton.label.calm.disabled};
    cursor: not-allowed;
  `,
} as const;

const sizeStyles = {
  'small (32px)': css`
    gap: ${({ theme }) => theme.spacing.inner.related};
    padding: ${({ theme }) => theme.spacing.paddings.compact}
      ${({ theme }) => theme.spacing.paddings.compactMedium};
  `,
  'extra small (24px)': css`
    height: ${({ theme }) => theme.spacing.height.xSmall};
    gap: ${({ theme }) => theme.spacing.inner.close};
    padding: ${({ theme }) => theme.spacing.inner.close}
      ${({ theme }) => theme.spacing.paddings.compact};
  `,
} as const;

const Root = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
`;

const Trigger = styled.button<StyledProps>`
  margin: 0;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.component.extraSmall};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.extraSmall};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  ${({ $state }) => stateStyles[$state]}
  ${({ $size }) => sizeStyles[$size]}

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  ${({ $state }) =>
    $state === 'enabled'
      ? css`
          &:hover:enabled {
            ${stateStyles.hover}
          }
          &:active:enabled {
            ${stateStyles.active}
          }
        `
      : null}
`;

const Label = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Caret = styled.span<{ $state: SelectButtonState }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.dropdownButton.caret.calm.disabled
      : theme.colors.dropdownButton.caret.calm.enabled};
`;

const DropdownLayer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${({ theme }) => theme.spacing.inner.close};
  min-width: 100%;
  z-index: 10;
`;

const defaultOptions: SelectButtonOption[] = [
  { value: 'attribute-1', label: 'Attribute 1' },
  { value: 'attribute-2', label: 'Attribute 2' },
  { value: 'attribute-3', label: 'Attribute 3' },
];

const CARET_SIZE = 16 as const;

export const SelectButton = ({
  options = defaultOptions,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'selectButton',
  size = 'small (32px)',
  state = 'enabled',
  disabled,
  type = 'button',
  ...rest
}: SelectButtonProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
    defaultValue ?? options[0]?.value,
  );

  const isDisabled = Boolean(disabled || state === 'disabled');
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolledValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue],
  );
  const dropdownOptions = useMemo<DropdownListOption[]>(
    () =>
      options.map((option) => ({
        id: option.value,
        label: option.label,
        ...(option.disabled !== undefined ? { disabled: option.disabled } : {}),
      })),
    [options],
  );

  const isListVisible = !isDisabled && (state === 'active' || (state === 'enabled' && isOpen));

  const resolvedState: SelectButtonState = isDisabled
    ? 'disabled'
    : state === 'enabled'
      ? isListVisible
        ? 'active'
        : 'enabled'
      : state;

  useEffect(() => {
    if (!isListVisible) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [isListVisible]);

  const toggleList = () => {
    if (isDisabled || state !== 'enabled') return;
    setIsOpen((previous) => !previous);
  };

  const handleSelect = (option: SelectButtonOption) => {
    if (option.disabled) return;
    if (!isControlled) setUncontrolledValue(option.value);
    onValueChange?.(option.value, option);
    setIsOpen(false);
  };

  return (
    <Root ref={rootRef}>
      <Trigger
        type={type}
        $state={resolvedState}
        $size={size}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isListVisible}
        onClick={toggleList}
        {...rest}
      >
        <Label>{selectedOption?.label ?? placeholder}</Label>
        <Caret $state={resolvedState}>
          <Icon
            icon={resolvedState === 'active' ? caretUpIconGlyph : caretDownIconGlyph}
            size={CARET_SIZE}
            aria-hidden="true"
          />
        </Caret>
      </Trigger>

      {isListVisible ? (
        <DropdownLayer>
          <DropdownList
            options={dropdownOptions}
            onSelect={(option) => {
              const selected = options.find((item) => item.value === option.id);
              if (!selected) return;
              handleSelect(selected);
            }}
          />
        </DropdownLayer>
      ) : null}
    </Root>
  );
};
