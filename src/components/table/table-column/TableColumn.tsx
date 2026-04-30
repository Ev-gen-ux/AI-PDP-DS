import styled from 'styled-components';
import { TableCellBadge } from '@/components/table-cell/badge';
import { TableCellEmptyState } from '@/components/table-cell/empty-state';
import { TableCellInlineEdit } from '@/components/table-cell/inline-edit';
import { TableCellSingleChoice } from '@/components/table-cell/single-choice';
import { TableCellSlotCentered } from '@/components/table-cell/slot-centered';
import { TableCellTextContent } from '@/components/table-cell/text-content';
import type { TableCellState } from '@/components/table-cell/shared/types';

const Root = styled.div`
  width: 920px;
  border: 1px solid ${({ theme }) => theme.colors.tableCell.border.enabled};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  overflow: hidden;
  display: flex;
  align-items: stretch;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Grow = styled(Column)`
  flex: 1;
`;

const columnStates: TableCellState[] = ['enabled', 'hover', 'active', 'selected'];

export const TableColumn = () => (
  <Root>
    <Column>
      {columnStates.map((state) => (
        <TableCellSingleChoice
          key={`single-${state}`}
          state={state}
          selected={state === 'selected'}
          checked={state === 'selected'}
        />
      ))}
    </Column>
    <Grow>
      {columnStates.map((state) => (
        <TableCellEmptyState
          key={`empty-${state}`}
          state={state}
          selected={state === 'selected'}
          width={180}
          stretch
        />
      ))}
    </Grow>
    <Grow>
      {columnStates.map((state) => (
        <TableCellTextContent
          key={`text-${state}`}
          state={state}
          selected={state === 'selected'}
          stretch
        />
      ))}
    </Grow>
    <Grow>
      {columnStates.map((state) => (
        <TableCellBadge
          key={`badge-${state}`}
          state={state}
          selected={state === 'selected'}
          stretch
        />
      ))}
    </Grow>
    <Column>
      {columnStates.map((state) => (
        <TableCellInlineEdit
          key={`inline-${state}`}
          state={state}
          selected={state === 'selected'}
          editing={state === 'active'}
        />
      ))}
    </Column>
    <Grow>
      {columnStates.map((state) => (
        <TableCellSlotCentered
          key={`slot-centered-${state}`}
          state={state}
          selected={state === 'selected'}
          stretch
        />
      ))}
    </Grow>
  </Root>
);
