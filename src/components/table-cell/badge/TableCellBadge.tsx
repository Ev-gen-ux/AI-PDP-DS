import { StatusLabel } from '@/components/status-label';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

export interface TableCellBadgeProps {
  state?: TableCellState;
  selected?: boolean;
  text?: string;
}

export const TableCellBadge = ({
  state = 'enabled',
  selected = false,
  text = 'Status Label',
}: TableCellBadgeProps) => (
  <TableCellFrame state={state} selected={selected} width={119} align="center">
    <StatusLabel
      appearance="secondary"
      status="success"
      size="small"
      withIcon={false}
      text={text}
    />
  </TableCellFrame>
);
