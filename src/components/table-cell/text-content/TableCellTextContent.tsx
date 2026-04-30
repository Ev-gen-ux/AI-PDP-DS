import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Icon, metaIconGlyph } from '@/components/icon';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.close};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;

export interface TableCellTextContentProps {
  state?: TableCellState;
  selected?: boolean;
  text?: string;
  iconBefore?: ReactNode | boolean;
}

export const TableCellTextContent = ({
  state = 'enabled',
  selected = false,
  text = 'textContent',
  iconBefore = true,
}: TableCellTextContentProps) => (
  <TableCellFrame state={state} selected={selected} width={134}>
    <Container>
      {iconBefore ? (
        typeof iconBefore === 'boolean' ? (
          <Icon icon={metaIconGlyph} size={16} aria-hidden="true" />
        ) : (
          iconBefore
        )
      ) : null}
      <Label>{text}</Label>
    </Container>
  </TableCellFrame>
);
