import type { HTMLAttributes } from 'react';
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
const GRID_SIZE = 12;

export interface YearPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Подпись диапазона в шапке (например «2001–2023»). */
  rangeLabel: string;
  /** Год в серой подписи над сеткой (первая колонка). */
  leadYear: number;
  /** Ровно 12 лет подряд для сетки 4×3 (по строкам). */
  years: readonly number[];
  selectedYear?: number | null;
  onRangeClick?: () => void;
  rangeDisabled?: boolean;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  prevPageDisabled?: boolean;
  nextPageDisabled?: boolean;
  onSelectYear?: (year: number) => void;
  rangeAriaLabel?: string;
  prevPageAriaLabel?: string;
  nextPageAriaLabel?: string;
}

function chunkYears(years: readonly number[]): number[][] {
  const rows: number[][] = [];
  for (let i = 0; i < years.length; i += GRID_COLUMNS) {
    rows.push([...years.slice(i, i + GRID_COLUMNS)]);
  }
  return rows;
}

export function YearPicker({
  rangeLabel,
  leadYear,
  years,
  selectedYear = null,
  onRangeClick,
  rangeDisabled,
  onPrevPage,
  onNextPage,
  prevPageDisabled,
  nextPageDisabled,
  onSelectYear,
  rangeAriaLabel,
  prevPageAriaLabel = 'Предыдущие годы',
  nextPageAriaLabel = 'Следующие годы',
  className,
  ...rest
}: YearPickerProps) {
  const rows = chunkYears(years.slice(0, GRID_SIZE));
  const gridId = rest.id != null ? `${rest.id}-grid` : undefined;

  return (
    <PickerPanel className={className} role="application" aria-label="Выбор года" {...rest}>
      <PickerChromeHeader
        rangeLabel={rangeLabel}
        onRangeClick={onRangeClick}
        rangeDisabled={rangeDisabled}
        onPrev={onPrevPage}
        onNext={onNextPage}
        prevDisabled={prevPageDisabled}
        nextDisabled={nextPageDisabled}
        prevAriaLabel={prevPageAriaLabel}
        nextAriaLabel={nextPageAriaLabel}
        rangeAriaLabel={rangeAriaLabel}
      />
      <PickerBody>
        <PickerLeadRow>
          <PickerLeadCell>
            <PickerLeadLabel>{String(leadYear)}</PickerLeadLabel>
          </PickerLeadCell>
        </PickerLeadRow>
        <PickerGrid
          role="grid"
          aria-colcount={GRID_COLUMNS}
          aria-rowcount={rows.length}
          id={gridId}
        >
          {rows.map((rowYears, rowIndex) => (
            <PickerGridRow key={rowYears.join('-')} role="row" aria-rowindex={rowIndex + 1}>
              {rowYears.map((y, colIndex) => {
                const selected = selectedYear != null && y === selectedYear;
                return (
                  <PickerGridCell key={y} role="gridcell" aria-colindex={colIndex + 1}>
                    <PickerChoiceButton
                      type="button"
                      $selected={selected}
                      aria-pressed={selected ? true : false}
                      onClick={() => onSelectYear?.(y)}
                      disabled={!onSelectYear}
                    >
                      {String(y)}
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
