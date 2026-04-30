import { SplitButton } from '@/components/split-button';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

export interface TableCellSplitButtonProps {
  state?: TableCellState;
  selected?: boolean;
  text?: string;
}

export const TableCellSplitButton = ({
  state = 'enabled',
  selected = false,
  text = 'Button Label',
}: TableCellSplitButtonProps) => (
  <TableCellFrame state={state} selected={selected} width={170} align="center" paddingY={8}>
    <SplitButton appearance="secondary" text={text} />
  </TableCellFrame>
);
