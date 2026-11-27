import {
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { styled, css } from 'styled-components';
import { DropdownList, type DropdownListOption } from '@/components/dropdown-list';
import { Icon, caretDownIconGlyph, caretUpIconGlyph, xIconGlyph } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';
import {
  SelectAnchor,
  SelectCaretWrap,
  SelectClearButton,
  SelectFieldShell,
  SelectListPopoverPanel,
  SelectMainButton,
  SelectRoot,
  SelectValueText,
  resolveSelectFieldState,
  type SelectFieldState,
} from './selectFieldShared';
import { useSelectListPopover } from './useSelectListPopover';

const CARET_SIZE = 24 as const;

const CursorLine = styled.span`
  display: inline-block;
  width: 0;
  height: ${({ theme }) => theme.spacing.height.small};
  border-left: 1px solid ${({ theme }) => theme.colors.select.cursor.enabled};
`;

const FocusPlaceholderRow = styled.span`
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
`;

const focusPlaceholderStyles = css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.select.textPlaceholder.enabled};
`;

const FocusPlaceholder = styled.span`
  ${focusPlaceholderStyles}
`;

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> {
  label?: string;
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option: SelectOption | null) => void;
  placeholder?: string;
  invalid?: boolean;
  success?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  onClear?: () => void;
  required?: boolean;
}

export const Select = ({
  id,
  label = 'Label',
  options = [],
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select value',
  required = false,
  disabled = false,
  invalid = false,
  success = false,
  helpMessage,
  errorMessage,
  onClear,
  ...rest
}: SelectProps) => {
  const reactId = useId();
  const listId = `${reactId}-list`;
  const buttonId = id ?? `select-${reactId}`;
  const anchorRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;
  const isDisabled = Boolean(disabled);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === current),
    [options, current],
  );
  const hasValue = Boolean(current && selectedOption);

  const effectiveSuccess = success || (hasValue && !invalid);

  const fieldState: SelectFieldState = resolveSelectFieldState({
    disabled: isDisabled,
    invalid,
    success: effectiveSuccess,
    focused: open,
    hovered,
  });

  const dropdownOptions = useMemo<DropdownListOption[]>(
    () =>
      options.map((o) => ({
        id: o.value,
        label: o.label,
        ...(o.disabled !== undefined ? { disabled: o.disabled } : {}),
      })),
    [options],
  );

  useSelectListPopover(open, anchorRef, popoverRef);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: globalThis.MouseEvent) => {
      const node = e.target as Node;
      if (anchorRef.current?.contains(node)) return;
      if (popoverRef.current?.contains(node)) return;
      setOpen(false);
    };
    const onDismissKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onDismissKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onDismissKey);
    };
  }, [open]);

  const handleToggle = () => {
    if (isDisabled) return;
    setOpen((o) => !o);
  };

  const handleClear = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isDisabled) return;
    if (!isControlled) setUncontrolled('');
    onClear?.();
    onValueChange?.('', null);
  };

  const messageId = `${buttonId}-message`;
  const hasErrorMessage = invalid && Boolean(errorMessage);
  const hasHelpMessage = !hasErrorMessage && Boolean(helpMessage);
  const describedBy = hasErrorMessage || hasHelpMessage ? messageId : undefined;

  return (
    <SelectRoot>
      <Label
        htmlFor={buttonId}
        text={label}
        required={required}
        state={isDisabled ? 'disabled' : 'default'}
      />
      <SelectAnchor ref={anchorRef}>
        <SelectFieldShell
          $state={fieldState}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <SelectMainButton
            {...rest}
            id={buttonId}
            type="button"
            disabled={isDisabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onClick={handleToggle}
          >
            {open && !hasValue ? (
              <FocusPlaceholderRow>
                <CursorLine aria-hidden />
                <FocusPlaceholder>{placeholder}</FocusPlaceholder>
              </FocusPlaceholderRow>
            ) : (
              <SelectValueText $hasValue={hasValue} $disabled={isDisabled}>
                {hasValue ? selectedOption?.label : placeholder}
              </SelectValueText>
            )}
            <SelectCaretWrap $disabled={isDisabled} aria-hidden>
              <Icon icon={open ? caretUpIconGlyph : caretDownIconGlyph} size={CARET_SIZE} />
            </SelectCaretWrap>
          </SelectMainButton>
          {!isDisabled && hasValue ? (
            <SelectClearButton type="button" aria-label="Clear selection" onClick={handleClear}>
              <Icon icon={xIconGlyph} size={16} />
            </SelectClearButton>
          ) : null}
        </SelectFieldShell>
      </SelectAnchor>
      {open && !isDisabled && typeof document !== 'undefined'
        ? createPortal(
            <SelectListPopoverPanel ref={popoverRef} role="presentation">
              <DropdownList
                id={listId}
                matchTriggerWidth
                options={dropdownOptions}
                onSelect={(opt) => {
                  const found = options.find((o) => o.value === opt.id);
                  if (!found || found.disabled) return;
                  if (!isControlled) setUncontrolled(found.value);
                  onValueChange?.(found.value, found);
                  setOpen(false);
                }}
              />
            </SelectListPopoverPanel>,
            document.body,
          )
        : null}
      {hasErrorMessage ? (
        <InlineMessage id={messageId} message={errorMessage as string} status="error" />
      ) : null}
      {hasHelpMessage ? <InlineMessage id={messageId} message={helpMessage as string} /> : null}
    </SelectRoot>
  );
};
