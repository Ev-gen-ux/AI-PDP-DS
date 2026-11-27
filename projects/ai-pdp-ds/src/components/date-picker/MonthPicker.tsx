import type { HTMLAttributes } from 'react';
import { formatMonthAbbrev } from './datePickerCalendar';
import {
  PickerBody,
  PickerChromeHeader,
  PickerGrid,
  PickerGridCell,
  PickerGridRow,
  PickerChoiceButton,
  PickerLeadCell,
  PickerLeadLabel,
  PickerLeadRow,
  PickerPanel,
} from './yearMonthPickerShared';

const GRID_COLUMNS = 4;
const MONTH_COUNT = 12;

export interface MonthPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Год контекста: подпись в первой колонке и локаль месяцев. */
  year: number;
  /** Подпись диапазона в шапке. */
  rangeLabel: string;
  selectedMonthIndex?: number | null;
  locale?: string;
  onRangeClick?: () => void;
  rangeDisabled?: boolean;
  onPrevYear?: () => void;
  onNextYear?: () => void;
  prevYearDisabled?: boolean;
  nextYearDisabled?: boolean;
  onSelectMonth?: (monthIndex: number) => void;
  rangeAriaLabel?: string;
  prevYearAriaLabel?: string;
  nextYearAriaLabel?: string;
}

function monthIndicesRows(): number[][] {
  const rows: number[][] = [];
  for (let i = 0; i < MONTH_COUNT; i += GRID_COLUMNS) {
    rows.push(Array.from({ length: GRID_COLUMNS }, (_, j) => i + j).filter((m) => m < MONTH_COUNT));
  }
  return rows;
}

export function MonthPicker({
  year,
  rangeLabel,
  selectedMonthIndex = null,
  locale = 'ru-RU',
  onRangeClick,
  rangeDisabled,
  onPrevYear,
  onNextYear,
  prevYearDisabled,
  nextYearDisabled,
  onSelectMonth,
  rangeAriaLabel,
  prevYearAriaLabel = 'Предыдущий год',
  nextYearAriaLabel = 'Следующий год',
  className,
  ...rest
}: MonthPickerProps) {
  const rows = monthIndicesRows();
  const gridId = rest.id != null ? `${rest.id}-grid` : undefined;

  return (
    <PickerPanel className={className} role="application" aria-label="Выбор месяца" {...rest}>
      <PickerChromeHeader
        rangeLabel={rangeLabel}
        onRangeClick={onRangeClick}
        rangeDisabled={rangeDisabled}
        onPrev={onPrevYear}
        onNext={onNextYear}
        prevDisabled={prevYearDisabled}
        nextDisabled={nextYearDisabled}
        prevAriaLabel={prevYearAriaLabel}
        nextAriaLabel={nextYearAriaLabel}
        rangeAriaLabel={rangeAriaLabel}
      />
      <PickerBody>
        <PickerLeadRow>
          <PickerLeadCell>
            <PickerLeadLabel>{String(year)}</PickerLeadLabel>
          </PickerLeadCell>
        </PickerLeadRow>
        <PickerGrid
          role="grid"
          aria-colcount={GRID_COLUMNS}
          aria-rowcount={rows.length}
          id={gridId}
        >
          {rows.map((monthRow, rowIndex) => (
            <PickerGridRow key={monthRow.join('-')} role="row" aria-rowindex={rowIndex + 1}>
              {monthRow.map((monthIndex, colIndex) => {
                const selected = selectedMonthIndex != null && monthIndex === selectedMonthIndex;
                const label = formatMonthAbbrev(year, monthIndex, locale);
                return (
                  <PickerGridCell key={monthIndex} role="gridcell" aria-colindex={colIndex + 1}>
                    <PickerChoiceButton
                      type="button"
                      $selected={selected}
                      aria-pressed={selected ? true : false}
                      onClick={() => onSelectMonth?.(monthIndex)}
                      disabled={!onSelectMonth}
                    >
                      {label}
                    </PickerChoiceButton>
                  </PickerGridCell>
                );
              })}
            </PickerGridRow>
          ))}
        </PickerGrid>
      </PickerBody>
    </PickerPanel>
  );
}
