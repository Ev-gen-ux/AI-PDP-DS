import type { ReactNode } from 'react';
import { styled } from 'styled-components';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

const Placeholder = styled.div`
  width: 56px;
  height: 24px;
  box-sizing: border-box;
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
`;

export interface TableCellSlotCenteredProps {
  state?: TableCellState;
  selected?: boolean;
  childrenSlot?: ReactNode;
  width?: number;
  stretch?: boolean;
}

export const TableCellSlotCentered = ({
  state = 'enabled',
  selected = false,
  childrenSlot,
  width = 96,
  stretch = false,
}: TableCellSlotCenteredProps) => (
  <TableCellFrame
    state={state}
    selected={selected}
    width={width}
    stretch={stretch}
    align="center"
    paddingY={8}
  >
    {childrenSlot ?? <Placeholder aria-hidden="true" />}
  </TableCellFrame>
);
