import styled from 'styled-components';
import { TableCellBadge } from '@/components/table-cell/badge';
import { TableCellEmptyState } from '@/components/table-cell/empty-state';
import { TableCellInlineEdit } from '@/components/table-cell/inline-edit';
import { TableCellSingleChoice } from '@/components/table-cell/single-choice';
import { TableCellSlotCentered } from '@/components/table-cell/slot-centered';
import { TableCellSlotLeftAligned } from '@/components/table-cell/slot-left-aligned';
import { TableCellTextContent } from '@/components/table-cell/text-content';
import type { TableCellState } from '@/components/table-cell/shared/types';

const Root = styled.div`
  width: 920px;
  border: 1px solid ${({ theme }) => theme.colors.tableCell.border.enabled};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Grow = styled.div`
  flex: 1;
  min-width: 0;
`;

type TableRowState = Extract<TableCellState, 'enabled' | 'hover' | 'active'>;

const renderRow = (state: TableRowState, selected = false) => (
  <Row>
    <TableCellSingleChoice state={state} selected={selected} checked={selected} />
    <TableCellEmptyState state={state} selected={selected} width={120} />
    <Grow>
      <TableCellTextContent state={state} selected={selected} stretch />
    </Grow>
    <Grow>
      <TableCellBadge state={state} selected={selected} stretch />
    </Grow>
    <Grow>
      <TableCellInlineEdit
        state={state}
        selected={selected}
        stretch
        editing={state === 'active' && !selected}
      />
    </Grow>
    <Grow>
      <TableCellSlotCentered state={state} selected={selected} stretch />
    </Grow>
    <Grow>
      <TableCellSlotLeftAligned state={state} selected={selected} stretch />
    </Grow>
  </Row>
);

export const TableRow = () => (
  <Root>
    {renderRow('enabled')}
    {renderRow('hover')}
    {renderRow('active')}
    {renderRow('enabled', true)}
  </Root>
);
