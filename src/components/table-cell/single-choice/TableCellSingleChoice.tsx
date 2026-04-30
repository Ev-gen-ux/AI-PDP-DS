import { Checkbox } from '@/components/checkbox';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

export interface TableCellSingleChoiceProps {
  state?: TableCellState;
  selected?: boolean;
  checked?: boolean;
}

export const TableCellSingleChoice = ({
  state = 'enabled',
  selected = false,
  checked = false,
}: TableCellSingleChoiceProps) => (
  <TableCellFrame state={state} selected={selected} width={44}>
    <Checkbox label="" checked={checked} />
  </TableCellFrame>
);
