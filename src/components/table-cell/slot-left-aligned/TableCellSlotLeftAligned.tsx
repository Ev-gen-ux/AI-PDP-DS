import type { ReactNode } from 'react';
import styled from 'styled-components';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

const Placeholder = styled.div`
  width: 56px;
  height: 24px;
  box-sizing: border-box;
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
`;

export interface TableCellSlotLeftAlignedProps {
  state?: TableCellState;
  selected?: boolean;
  childrenSlot?: ReactNode;
}

export const TableCellSlotLeftAligned = ({
  state = 'enabled',
  selected = false,
  childrenSlot,
}: TableCellSlotLeftAlignedProps) => (
  <TableCellFrame state={state} selected={selected} width={96} paddingY={8}>
    {childrenSlot ?? <Placeholder aria-hidden="true" />}
  </TableCellFrame>
);
