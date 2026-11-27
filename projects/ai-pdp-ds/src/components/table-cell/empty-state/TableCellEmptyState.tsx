import { styled } from 'styled-components';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;

export interface TableCellEmptyStateProps {
  state?: TableCellState;
  selected?: boolean;
  text?: string;
  width?: number;
  stretch?: boolean;
}

export const TableCellEmptyState = ({
  state = 'enabled',
  selected = false,
  text = '---',
  width = 180,
  stretch = false,
}: TableCellEmptyStateProps) => (
  <TableCellFrame state={state} selected={selected} width={width} stretch={stretch}>
    <Value>{text}</Value>
  </TableCellFrame>
);
