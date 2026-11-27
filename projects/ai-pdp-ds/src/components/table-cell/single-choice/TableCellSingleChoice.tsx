import { Checkbox } from '@/components/checkbox';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

export interface TableCellSingleChoiceProps {
  state?: TableCellState;
  selected?: boolean;
  checked?: boolean;
  width?: number;
}

export const TableCellSingleChoice = ({
  state = 'enabled',
  selected = false,
  checked = false,
  width = 44,
}: TableCellSingleChoiceProps) => (
  <TableCellFrame state={state} selected={selected} width={width}>
    <Checkbox label="" checked={checked} />
  </TableCellFrame>
);
