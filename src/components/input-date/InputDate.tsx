import {
  type ChangeEvent,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { DatePicker } from '@/components/date-picker/DatePicker';
import { MonthPicker } from '@/components/date-picker/MonthPicker';
import { YearPicker } from '@/components/date-picker/YearPicker';
import { Icon, calendarBlankIconGlyph } from '../icon/Icon';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

const YEAR_MIN = 1900;
const YEAR_MAX = 2100;

type PanelView = 'day' | 'month' | 'year';

function parseIsoParts(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]) - 1;
  const d = Number(match[3]);
  if (m < 0 || m > 11 || d < 1 || d > 31) return null;
  const dt = new Date(y, m, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d) return null;
  return { y, m, d };
}

function clampDay(y: number, m: number, day: number): Date {
  const last = new Date(y, m + 1, 0).getDate();
  const d = Math.min(day, last);
  return new Date(y, m, d);
}

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function alignYearPageStart(year: number): number {
  const c = Math.min(Math.max(year, YEAR_MIN), YEAR_MAX);
  let start = c - ((c - YEAR_MIN) % 12);
  if (start + 11 > YEAR_MAX) start = YEAR_MAX - 11;
  return start;
}

function viewLabels(locale: string): { day: string; month: string; year: string } {
  return locale.toLowerCase().startsWith('ru')
    ? { day: 'День', month: 'Месяц', year: 'Год' }
    : { day: 'Day', month: 'Month', year: 'Year' };
}

/** Отступ под полем как у `theme.spacing.inner.related` (для fixed без margin-коллапса). */
function readRelatedGapPx(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 8;
  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--spacing-inner-related')
    .trim();
  if (raw.endsWith('px')) {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 8;
  }
  return 8;
}

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
  /** Локаль подписей в выпадающем календаре (месяцы, дни недели). */
  locale?: string;
  /** Первая колонка недели в сетке: 0 — вс, 1 — пн. */
  weekStartsOn?: 0 | 1;
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

const Anchor = styled.div`
  position: relative;
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

const NativeDate = styled.input<{
  $hasValue: boolean;
  $inputFocused: boolean;
  $disabled: boolean;
}>`
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
  color: ${({ theme, $hasValue, $inputFocused, $disabled }) => {
    const showValueText = $hasValue || $inputFocused;
    if (!showValueText) return 'transparent';
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

const PopoverPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3200;
  box-sizing: border-box;
`;

const ViewMenuPositioner = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.paddings.default};
  left: ${({ theme }) => theme.spacing.paddings.relaxed};
  z-index: 20;
`;

const ViewMenu = styled.ul`
  list-style: none;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.inner.closest};
  box-sizing: border-box;
  min-width: 160px;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  background-color: ${({ theme }) => theme.colors.datePicker.background.calm.enabled};
  box-shadow: ${({ theme }) => theme.effects.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.datePicker.border.calm.enabled};
`;

const ViewMenuItem = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.inner.close} ${({ theme }) => theme.spacing.inner.related};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.datePicker.buttonDay.background.hover : 'transparent'};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.datePicker.label.calm.enabled};
  text-align: left;
  cursor: pointer;

  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.hover};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
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
  locale = 'ru-RU',
  weekStartsOn = 1,
  ...rest
}: InputDateProps) => {
  const reactId = useId();
  const inputId = id ?? `input-date-${reactId}`;
  const menuId = `${inputId}-view-menu`;
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /** Фокус только на нативном date input (не на кнопке календаря) — скрывает кастомный плейсхолдер при вводе. */
  const [inputFocused, setInputFocused] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>('day');
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [yearPageStart, setYearPageStart] = useState(() =>
    alignYearPageStart(new Date().getFullYear()),
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value ?? '') : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const showPlaceholderOverlay = !hasValue && !inputFocused;

  const labels = useMemo(() => viewLabels(locale), [locale]);

  const syncNavigationFromValue = useCallback((iso: string) => {
    const parts = parseIsoParts(iso);
    const base = parts ?? {
      y: new Date().getFullYear(),
      m: new Date().getMonth(),
      d: new Date().getDate(),
    };
    setViewYear(base.y);
    setViewMonth(base.m);
    setYearPageStart(alignYearPageStart(base.y));
  }, []);

  const openPopover = useCallback(() => {
    if (disabled) return;
    syncNavigationFromValue(currentValue);
    setPanelView('day');
    setViewMenuOpen(false);
    setPopoverOpen(true);
  }, [disabled, currentValue, syncNavigationFromValue]);

  const closePopover = useCallback(() => {
    setPopoverOpen(false);
    setViewMenuOpen(false);
  }, []);

  const emitValue = useCallback(
    (iso: string) => {
      if (!isControlled) {
        setUncontrolledValue(iso);
      }
      if (!onChange) return;
      const el = inputRef.current;
      onChange({
        target: {
          value: iso,
          name: name ?? el?.name ?? '',
        },
        currentTarget: el ?? ({} as HTMLInputElement),
      } as ChangeEvent<HTMLInputElement>);
    },
    [isControlled, name, onChange],
  );

  const selectedDate = useMemo(() => {
    const p = parseIsoParts(currentValue);
    return p ? new Date(p.y, p.m, p.d) : null;
  }, [currentValue]);

  const selectedDayFallback = selectedDate?.getDate() ?? new Date().getDate();

  const positionPopover = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = popoverRef.current;
    if (!anchor || !panel || !popoverOpen) return;
    const rect = anchor.getBoundingClientRect();
    const gap = readRelatedGapPx();
    panel.style.top = `${rect.bottom + gap}px`;
    panel.style.left = `${rect.left}px`;
  }, [popoverOpen]);

  useLayoutEffect(() => {
    positionPopover();
  }, [positionPopover, panelView, viewMenuOpen, viewYear, viewMonth, yearPageStart]);

  useEffect(() => {
    if (!popoverOpen) return;
    window.addEventListener('resize', positionPopover);
    window.addEventListener('scroll', positionPopover, true);
    return () => {
      window.removeEventListener('resize', positionPopover);
      window.removeEventListener('scroll', positionPopover, true);
    };
  }, [popoverOpen, positionPopover]);

  useEffect(() => {
    if (!popoverOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const node = e.target as Node;
      if (anchorRef.current?.contains(node)) return;
      if (popoverRef.current?.contains(node)) return;
      closePopover();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopover();
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [popoverOpen, closePopover]);

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

  const toggleViewMenu = useCallback(() => {
    setViewMenuOpen((o) => !o);
  }, []);

  const selectPanelView = useCallback((next: PanelView) => {
    setPanelView(next);
    setViewMenuOpen(false);
  }, []);

  const yearGridYears = useMemo(
    () => Array.from({ length: 12 }, (_, i) => yearPageStart + i),
    [yearPageStart],
  );

  const yearRangeLabel = `${yearPageStart}–${yearPageStart + 11}`;

  return (
    <Root>
      <Label
        htmlFor={inputId}
        text={label}
        required={required}
        state={disabled ? 'disabled' : 'default'}
      />
      <Anchor ref={anchorRef}>
        <Field
          $state={state}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={() => setFocused(false)}
        >
          <InputShell>
            {showPlaceholderOverlay ? (
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
              onFocus={(e) => {
                setInputFocused(true);
                rest.onFocus?.(e);
              }}
              onBlur={(e) => {
                setInputFocused(false);
                rest.onBlur?.(e);
              }}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              $hasValue={hasValue}
              $inputFocused={inputFocused}
              $disabled={disabled}
            />
          </InputShell>
          <CalendarButton
            type="button"
            $disabled={disabled}
            disabled={disabled}
            aria-label="Open date picker"
            aria-expanded={popoverOpen}
            aria-haspopup="dialog"
            onClick={() => (popoverOpen ? closePopover() : openPopover())}
          >
            <Icon icon={calendarBlankIconGlyph} size={24} />
          </CalendarButton>
        </Field>
      </Anchor>

      {popoverOpen && typeof document !== 'undefined'
        ? createPortal(
            <PopoverPanel ref={popoverRef} role="presentation">
              {viewMenuOpen ? (
                <ViewMenuPositioner>
                  <ViewMenu
                    id={menuId}
                    role="listbox"
                    aria-label={
                      locale.toLowerCase().startsWith('ru') ? 'Вид календаря' : 'Calendar view'
                    }
                  >
                    <li>
                      <ViewMenuItem
                        type="button"
                        role="option"
                        aria-selected={panelView === 'day'}
                        $active={panelView === 'day'}
                        onClick={() => selectPanelView('day')}
                      >
                        {labels.day}
                      </ViewMenuItem>
                    </li>
                    <li>
                      <ViewMenuItem
                        type="button"
                        role="option"
                        aria-selected={panelView === 'month'}
                        $active={panelView === 'month'}
                        onClick={() => selectPanelView('month')}
                      >
                        {labels.month}
                      </ViewMenuItem>
                    </li>
                    <li>
                      <ViewMenuItem
                        type="button"
                        role="option"
                        aria-selected={panelView === 'year'}
                        $active={panelView === 'year'}
                        onClick={() => selectPanelView('year')}
                      >
                        {labels.year}
                      </ViewMenuItem>
                    </li>
                  </ViewMenu>
                </ViewMenuPositioner>
              ) : null}

              {panelView === 'day' ? (
                <DatePicker
                  year={viewYear}
                  monthIndex={viewMonth}
                  selectedDate={selectedDate}
                  todayDate={new Date()}
                  weekStartsOn={weekStartsOn}
                  locale={locale}
                  onMonthYearHeaderClick={toggleViewMenu}
                  monthYearHeaderMenuOpen={viewMenuOpen && panelView === 'day'}
                  onMonthPrev={() => {
                    const d = new Date(viewYear, viewMonth - 1, 1);
                    setViewYear(d.getFullYear());
                    setViewMonth(d.getMonth());
                  }}
                  onMonthNext={() => {
                    const d = new Date(viewYear, viewMonth + 1, 1);
                    setViewYear(d.getFullYear());
                    setViewMonth(d.getMonth());
                  }}
                  onSelectDate={(d) => {
                    emitValue(toIsoDate(d));
                    closePopover();
                  }}
                />
              ) : null}

              {panelView === 'month' ? (
                <MonthPicker
                  year={viewYear}
                  rangeLabel={String(viewYear)}
                  selectedMonthIndex={
                    selectedDate && selectedDate.getFullYear() === viewYear
                      ? selectedDate.getMonth()
                      : null
                  }
                  locale={locale}
                  onRangeClick={toggleViewMenu}
                  rangeDisabled={disabled}
                  onPrevYear={() => setViewYear((y) => y - 1)}
                  onNextYear={() => setViewYear((y) => y + 1)}
                  prevYearDisabled={viewYear <= YEAR_MIN}
                  nextYearDisabled={viewYear >= YEAR_MAX}
                  onSelectMonth={(monthIndex) => {
                    setViewMonth(monthIndex);
                    const day = selectedDate ? selectedDate.getDate() : selectedDayFallback;
                    const next = clampDay(viewYear, monthIndex, day);
                    setViewYear(next.getFullYear());
                    setViewMonth(next.getMonth());
                    selectPanelView('day');
                  }}
                  rangeAriaLabel={`${labels.month}, ${viewYear}`}
                />
              ) : null}

              {panelView === 'year' ? (
                <YearPicker
                  rangeLabel={yearRangeLabel}
                  leadYear={yearPageStart + 11}
                  years={yearGridYears}
                  selectedYear={selectedDate?.getFullYear() ?? null}
                  onRangeClick={toggleViewMenu}
                  rangeDisabled={disabled}
                  onPrevPage={() => setYearPageStart((s) => Math.max(YEAR_MIN, s - 12))}
                  onNextPage={() => setYearPageStart((s) => Math.min(YEAR_MAX - 11, s + 12))}
                  prevPageDisabled={yearPageStart <= YEAR_MIN}
                  nextPageDisabled={yearPageStart + 11 >= YEAR_MAX}
                  onSelectYear={(y) => {
                    setViewYear(y);
                    setYearPageStart(alignYearPageStart(y));
                    selectPanelView('month');
                  }}
                  rangeAriaLabel={labels.year}
                />
              ) : null}
            </PopoverPanel>,
            document.body,
          )
        : null}
      {hasErrorMessage ? (
        <InlineMessage id={messageId} message={errorMessage as string} status="error" />
      ) : null}
      {hasHelpMessage ? <InlineMessage id={messageId} message={helpMessage as string} /> : null}
    </Root>
  );
};
