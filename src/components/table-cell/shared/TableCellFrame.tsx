import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import type { TableCellState } from './types';

type FrameProps = {
  $state: TableCellState;
  $width?: number;
  $align?: 'left' | 'center';
  $paddingY?: number;
};

const stateStyles = {
  enabled: css`
    background: ${({ theme }) => theme.colors.tableCell.background.enabled};
    border-bottom-color: ${({ theme }) => theme.colors.tableCell.border.enabled};
  `,
  hover: css`
    background: ${({ theme }) => theme.colors.tableCell.background.hover};
    border-bottom-color: ${({ theme }) => theme.colors.tableCell.border.hover};
  `,
  active: css`
    background: ${({ theme }) => theme.colors.tableCell.background.active};
    border-bottom-color: ${({ theme }) => theme.colors.tableCell.border.active};
  `,
  selected: css`
    background: ${({ theme }) => theme.colors.tableCell.background.selected};
    border-bottom-color: ${({ theme }) => theme.colors.tableCell.border.selected};
  `,
} as const;

const Root = styled.div<FrameProps>`
  box-sizing: border-box;
  height: 48px;
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
  padding: ${({ $paddingY = 12 }) => `${$paddingY}px`} 12px;
  display: flex;
  align-items: center;
  justify-content: ${({ $align = 'left' }) => ($align === 'center' ? 'center' : 'flex-start')};
  overflow: hidden;
  border-bottom: 1px solid;
  ${({ $state }) => stateStyles[$state]}
`;

export interface TableCellFrameProps {
  state?: TableCellState;
  selected?: boolean;
  width?: number;
  align?: 'left' | 'center';
  paddingY?: number;
  children?: ReactNode;
}

export const TableCellFrame = ({
  state = 'enabled',
  selected = false,
  width,
  align = 'left',
  paddingY,
  children,
}: TableCellFrameProps) => {
  const resolvedState: TableCellState = selected ? 'selected' : state;
  const optionalProps = {
    ...(width !== undefined ? { $width: width } : {}),
    ...(paddingY !== undefined ? { $paddingY: paddingY } : {}),
  };

  return (
    <Root $state={resolvedState} $align={align} {...optionalProps}>
      {children}
    </Root>
  );
};
