import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import {
  Icon,
  datePickerMonthSelectIconGlyph,
  datePickerNextMonthIconGlyph,
  datePickerPrevMonthIconGlyph,
} from '@/components/icon';
import {
  buildMonthGrid,
  formatMonthAbbrev,
  isInMonth,
  isSameCalendarDay,
  isWeekend,
  weekdayLabels,
} from './datePickerCalendar';

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Год отображаемого месяца */
  year: number;
  /** Месяц 0–11 */
  monthIndex: number;
  /** Выбранный день (заливка по макету) */
  selectedDate?: Date | null;
  /** «Сегодня» — обводка по макету, если день не выбран */
  todayDate?: Date | null;
  /** 0 — неделя с воскресенья, 1 — с понедельника (как в макете) */
  weekStartsOn?: 0 | 1;
  locale?: string;
  onMonthPrev?: () => void;
  onMonthNext?: () => void;
  onSelectDate?: (date: Date) => void;
}

type DayButtonStyledProps = {
  $outside: boolean;
  $selected: boolean;
  $today: boolean;
  $weekend: boolean;
};

const Panel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compactMedium};
  width: fit-content;
  padding: ${({ theme }) => theme.spacing.paddings.default}
    ${({ theme }) => theme.spacing.paddings.relaxed};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  background-color: ${({ theme }) => theme.colors.datePicker.background.calm.enabled};
  box-shadow: ${({ theme }) => theme.effects.surface.elevated};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: calc(${({ theme }) => theme.spacing.height.small} * 7);
  gap: ${({ theme }) => theme.spacing.inner.related};
`;

const MonthBlock = styled.div`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-width: 0;
  color: ${({ theme }) => theme.colors.datePicker.caret.calm.enabled};
`;

const MonthTitle = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.datePicker.label.calm.enabled};
  white-space: nowrap;
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
`;

const NavGroup = styled.div`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
`;

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: ${({ theme }) => theme.spacing.height.base};
  min-height: ${({ theme }) => theme.spacing.height.base};
  margin: 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  background: transparent;
  color: ${({ theme }) => theme.colors.datePicker.caret.calm.enabled};
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.datePicker.caret.calm.disabled};
    cursor: not-allowed;
  }
`;

const CalendarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.close};
  align-items: flex-start;
`;

const WeekdayRow = styled.div`
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  width: calc(${({ theme }) => theme.spacing.height.small} * 7);
  padding-bottom: ${({ theme }) => theme.spacing.inner.close};
  border-bottom: 1px solid ${({ theme }) => theme.colors.datePicker.border.calm.enabled};
`;

const WeekdayCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing.height.small};
  height: ${({ theme }) => theme.spacing.height.small};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.datePicker.label.calm.secondary};
  text-align: center;
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
`;

const DaysGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.close};
  padding-top: ${({ theme }) => theme.spacing.inner.close};
`;

const WeekRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

const GridCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing.height.small};
  height: ${({ theme }) => theme.spacing.height.small};
`;

/** Первая ячейка строки дат: сокращение месяца по макету Figma (`datePicker/label/calm/secondary`). */
const MonthLeadLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.datePicker.label.calm.secondary};
  text-align: center;
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
`;

const dayButtonStyles = {
  base: css`
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-width: ${({ theme }) => theme.spacing.height.small};
    min-height: ${({ theme }) => theme.spacing.height.small};
    margin: 0;
    padding: 0;
    border-width: 1px;
    border-style: solid;
    border-radius: ${({ theme }) => theme.borderRadius.componentBase};
    font-family: ${({ theme }) => theme.typography.fontFamily.component};
    font-size: ${({ theme }) => theme.typography.fontSize.component.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    text-align: center;
    cursor: pointer;
    font-feature-settings:
      'lnum' 1,
      'tnum' 1;

    &:focus-visible {
      outline: none;
      box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
    }
  `,
  outside: css`
    color: ${({ theme }) => theme.colors.datePicker.label.calm.secondary};
    background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.enabled};
    border-color: transparent;
    pointer-events: none;
    cursor: default;
  `,
  inMonth: css`
    color: ${({ theme }) => theme.colors.datePicker.label.calm.enabled};
    background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.enabled};
    border-color: transparent;

    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.hover};
    }
  `,
  weekend: css`
    color: ${({ theme }) => theme.colors.datePicker.label.calm.red};
  `,
  today: css`
    border-color: ${({ theme }) => theme.colors.datePicker.border.calm.active};
  `,
  selected: css`
    color: ${({ theme }) => theme.colors.datePicker.label.calm.inverted};
    background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.active};
    border-color: transparent;

    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.active};
    }
  `,
} as const;

const DayButton = styled.button<DayButtonStyledProps>`
  ${dayButtonStyles.base}
  ${({ $outside }) => ($outside ? dayButtonStyles.outside : dayButtonStyles.inMonth)}
  ${({ $weekend, $outside, $selected, $today }) =>
    !$outside && !$selected && !$today && $weekend && dayButtonStyles.weekend}
  ${({ $selected }) => $selected && dayButtonStyles.selected}
  ${({ $today, $selected }) => !$selected && $today && dayButtonStyles.today}
`;

function formatMonthYear(year: number, monthIndex: number, locale: string): string {
  const d = new Date(year, monthIndex, 1);
  const raw = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d);
  if (!raw) return raw;
  /* «сентябрь 2025 г.» → «Сентябрь 2025 г.» */
  return raw.charAt(0).toLocaleUpperCase(locale) + raw.slice(1);
}

function formatDayAriaLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Макет: подписи дней как «Пн», «Вт» — заглавная первая буква (Intl часто даёт «пн», «вт»). */
function capitalizeWeekdayLabel(label: string, locale: string): string {
  if (!label) return label;
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
}

export const DatePicker = ({
  year,
  monthIndex,
  selectedDate = null,
  todayDate = null,
  weekStartsOn = 1,
  locale = 'ru-RU',
  onMonthPrev,
  onMonthNext,
  onSelectDate,
  className,
  ...rest
}: DatePickerProps) => {
  const weekdays = weekdayLabels(weekStartsOn, locale);
  const grid = buildMonthGrid(year, monthIndex, weekStartsOn);
  const weeks: Date[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  const monthTitle = formatMonthYear(year, monthIndex, locale);

  return (
    <Panel className={className} role="application" aria-label="Календарь" {...rest}>
      <Header>
        <MonthBlock>
          <MonthTitle aria-live="polite">{monthTitle}</MonthTitle>
          <Icon
            icon={datePickerMonthSelectIconGlyph}
            size={16}
            weight="bold"
            color="currentColor"
            aria-hidden
          />
        </MonthBlock>
        <NavGroup>
          <NavButton
            type="button"
            aria-label="Предыдущий месяц"
            disabled={!onMonthPrev}
            onClick={onMonthPrev}
          >
            <Icon
              icon={datePickerPrevMonthIconGlyph}
              size={16}
              weight="bold"
              color="currentColor"
              aria-hidden
            />
          </NavButton>
          <NavButton
            type="button"
            aria-label="Следующий месяц"
            disabled={!onMonthNext}
            onClick={onMonthNext}
          >
            <Icon
              icon={datePickerNextMonthIconGlyph}
              size={16}
              weight="bold"
              color="currentColor"
              aria-hidden
            />
          </NavButton>
        </NavGroup>
      </Header>

      <CalendarSection>
        <WeekdayRow>
          {weekdays.map((label, index) => (
            <WeekdayCell key={`${label}-${String(index)}`}>
              {capitalizeWeekdayLabel(label, locale)}
            </WeekdayCell>
          ))}
        </WeekdayRow>

        <DaysGrid role="grid">
          {weeks.map((row, rowIndex) => {
            const firstInMonthCol = row.findIndex((d) => isInMonth(d, year, monthIndex));
            const useMonthLeadRow = rowIndex === 0 && firstInMonthCol > 0;

            return (
              <WeekRow key={rowIndex} role="row">
                {Array.from({ length: 7 }, (_, colIndex) => {
                  if (useMonthLeadRow && colIndex < firstInMonthCol) {
                    if (colIndex === 0) {
                      return (
                        <GridCell
                          key={`month-lead-${String(rowIndex)}-${String(colIndex)}`}
                          role="gridcell"
                          aria-hidden
                        >
                          <MonthLeadLabel>
                            {formatMonthAbbrev(year, monthIndex, locale)}
                          </MonthLeadLabel>
                        </GridCell>
                      );
                    }
                    return (
                      <GridCell
                        key={`month-lead-empty-${String(rowIndex)}-${String(colIndex)}`}
                        role="gridcell"
                        aria-hidden
                      />
                    );
                  }

                  if (colIndex >= row.length) {
                    return (
                      <GridCell
                        key={`trail-${String(rowIndex)}-${String(colIndex)}`}
                        role="gridcell"
                        aria-hidden
                      />
                    );
                  }

                  const date = row[colIndex]!;
                  const outside = !isInMonth(date, year, monthIndex);
                  const selected = selectedDate != null && isSameCalendarDay(date, selectedDate);
                  const today = todayDate != null && isSameCalendarDay(date, todayDate);
                  const weekend = !outside && isWeekend(date);
                  const label = String(date.getDate());
                  const ariaLabel = formatDayAriaLabel(date, locale);

                  return (
                    <GridCell key={date.getTime()} role="gridcell">
                      <DayButton
                        type="button"
                        $outside={outside}
                        $selected={selected}
                        $today={today}
                        $weekend={weekend}
                        tabIndex={outside ? -1 : 0}
                        aria-selected={selected || undefined}
                        aria-current={today && !selected ? 'date' : undefined}
                        disabled={outside}
                        aria-label={ariaLabel}
                        onClick={() => {
                          if (!outside) onSelectDate?.(date);
                        }}
                      >
                        {label}
                      </DayButton>
                    </GridCell>
                  );
                })}
              </WeekRow>
            );
          })}
        </DaysGrid>
      </CalendarSection>
    </Panel>
  );
};
