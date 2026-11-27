import { SplitButton } from '@/components/split-button';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

export interface TableCellSplitButtonProps {
  state?: TableCellState;
  selected?: boolean;
  text?: string;
  width?: number;
}

export const TableCellSplitButton = ({
  state = 'enabled',
  selected = false,
  text = 'Button Label',
  width = 170,
}: TableCellSplitButtonProps) => (
  <TableCellFrame state={state} selected={selected} width={width} align="center" paddingY={8}>
    <SplitButton appearance="secondary" text={text} />
  </TableCellFrame>
);
