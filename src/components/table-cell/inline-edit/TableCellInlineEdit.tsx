import {
  type ChangeEvent,
  type ChangeEventHandler,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { TableCellFrame } from '../shared/TableCellFrame';
import type { TableCellState } from '../shared/types';

const Text = styled.span`
  color: ${({ theme }) => theme.colors.tableCell.text.inlineEdit.enabled};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.closest};
  min-width: 0;
`;

const CellButton = styled.button`
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  text-align: left;
  cursor: text;
`;

const EditInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.tableCell.text.inlineEdit.enabled};
  caret-color: ${({ theme }) => theme.colors.tableCell.inlineEdit.border.focus};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;

export interface TableCellInlineEditProps {
  state?: TableCellState;
  selected?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onCommit?: (value: string) => void;
  onCancel?: (value: string) => void;
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

export const TableCellInlineEdit = ({
  state,
  selected = false,
  value,
  defaultValue = 'textContent',
  placeholder = 'textContent',
  onChange,
  onCommit,
  onCancel,
  editing,
  onEditingChange,
}: TableCellInlineEditProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isValueControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = isValueControlled ? value : uncontrolledValue;

  const isEditingControlled = editing !== undefined;
  const [uncontrolledEditing, setUncontrolledEditing] = useState(false);
  const isEditing = isEditingControlled ? editing : uncontrolledEditing;

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [draftValue, setDraftValue] = useState(currentValue);

  useEffect(() => {
    if (isEditing) {
      setDraftValue(currentValue);
      inputRef.current?.focus();
      const caretPos = currentValue.length;
      inputRef.current?.setSelectionRange(caretPos, caretPos);
    }
  }, [isEditing, currentValue]);

  const setEditingState = (next: boolean) => {
    if (!isEditingControlled) {
      setUncontrolledEditing(next);
    }
    onEditingChange?.(next);
  };

  const commit = () => {
    if (!isValueControlled) {
      setUncontrolledValue(draftValue);
    }
    onCommit?.(draftValue);
    setEditingState(false);
  };

  const cancel = () => {
    setDraftValue(currentValue);
    onCancel?.(currentValue);
    setEditingState(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftValue(event.target.value);
    onChange?.(event);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
    }
  };

  const resolvedState = useMemo<TableCellState>(() => {
    if (selected) return 'selected';
    if (isEditing) return 'active';
    if (pressed) return 'active';
    if (hovered) return 'hover';
    return state ?? 'enabled';
  }, [hovered, isEditing, pressed, selected, state]);

  return (
    <TableCellFrame state={resolvedState} selected={selected} width={114} align="center">
      {isEditing ? (
        <EditInput
          ref={inputRef}
          value={draftValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={commit}
          placeholder={placeholder}
          aria-label="Inline edit value"
        />
      ) : (
        <CellButton
          type="button"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setPressed(false);
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onDoubleClick={() => setEditingState(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              setEditingState(true);
            }
          }}
        >
          <Container>
            <Text>{currentValue || placeholder}</Text>
          </Container>
        </CellButton>
      )}
    </TableCellFrame>
  );
};
