import {
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { Chips } from '@/components/chips';
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
  SelectMainHit,
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

const ChipsCluster = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.close};
  min-width: 0;
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

const FocusPlaceholderRow = styled.span`
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
`;

export interface MultiselectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiselectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  options?: MultiselectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
  success?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  onClear?: () => void;
  required?: boolean;
  disabled?: boolean;
}

export const Multiselect = ({
  id,
  label = 'Label',
  options = [],
  value,
  defaultValue = [],
  onValueChange,
  placeholder = 'Multiselect',
  required = false,
  disabled = false,
  invalid = false,
  success = false,
  helpMessage,
  errorMessage,
  onClear,
  ...rest
}: MultiselectProps) => {
  const reactId = useId();
  const listId = `${reactId}-list`;
  const controlId = id ?? `multiselect-${reactId}`;
  const anchorRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;
  const isDisabled = Boolean(disabled);

  const selectedOptions = useMemo(
    () => options.filter((o) => current.includes(o.value)),
    [options, current],
  );
  const hasValue = selectedOptions.length > 0;

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

  const setValues = (next: string[]) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const toggleOpen = () => {
    if (isDisabled) return;
    setOpen((o) => !o);
  };

  const toggleOption = (opt: MultiselectOption) => {
    if (opt.disabled) return;
    const set = new Set(current);
    if (set.has(opt.value)) set.delete(opt.value);
    else set.add(opt.value);
    setValues(Array.from(set));
  };

  const removeValue = (v: string) => {
    setValues(current.filter((x) => x !== v));
  };

  const handleClearAll = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isDisabled) return;
    setValues([]);
    onClear?.();
  };

  const onHitKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
    if (e.key === 'Escape') setOpen(false);
  };

  const messageId = `${controlId}-message`;
  const hasErrorMessage = invalid && Boolean(errorMessage);
  const hasHelpMessage = !hasErrorMessage && Boolean(helpMessage);
  const describedBy = hasErrorMessage || hasHelpMessage ? messageId : undefined;

  return (
    <SelectRoot {...rest}>
      <Label
        htmlFor={controlId}
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
          <SelectMainHit
            id={controlId}
            role="combobox"
            tabIndex={isDisabled ? -1 : 0}
            aria-disabled={isDisabled || undefined}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            $disabled={isDisabled}
            onClick={toggleOpen}
            onKeyDown={onHitKeyDown}
          >
            {hasValue ? (
              <ChipsCluster>
                {selectedOptions.map((opt) => (
                  <Chips
                    key={opt.value}
                    label={opt.label}
                    size="extra small (24px)"
                    closable
                    state="enabled"
                    disabled={isDisabled}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) removeValue(opt.value);
                    }}
                  />
                ))}
              </ChipsCluster>
            ) : open ? (
              <FocusPlaceholderRow>
                <CursorLine aria-hidden />
                <FocusPlaceholder>{placeholder}</FocusPlaceholder>
              </FocusPlaceholderRow>
            ) : (
              <SelectValueText $hasValue={false} $disabled={isDisabled}>
                {placeholder}
              </SelectValueText>
            )}
            <SelectCaretWrap $disabled={isDisabled} aria-hidden>
              <Icon icon={open ? caretUpIconGlyph : caretDownIconGlyph} size={CARET_SIZE} />
            </SelectCaretWrap>
          </SelectMainHit>
          {!isDisabled && hasValue ? (
            <SelectClearButton
              type="button"
              aria-label="Clear all selections"
              onClick={handleClearAll}
            >
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
                onSelect={(item) => {
                  const found = options.find((o) => o.value === item.id);
                  if (found) toggleOption(found);
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
