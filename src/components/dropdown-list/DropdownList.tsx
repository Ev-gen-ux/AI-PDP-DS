import type { ReactNode } from 'react';
import styled from 'styled-components';
import { DropdownItem } from '@/components/dropdown-item/DropdownItem';

export interface DropdownListOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  iconBefore?: ReactNode | boolean;
}

export interface DropdownListProps {
  options?: DropdownListOption[];
  onSelect?: (option: DropdownListOption, index: number) => void;
}

const Root = styled.div`
  width: 248px;
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.inner.closest} 0;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  border: 1px solid ${({ theme }) => theme.colors.dropdownList.border.enabled};
  background-color: ${({ theme }) => theme.colors.dropdownList.background};
  box-shadow: ${({ theme }) => theme.effects.surface.elevated};
`;

const defaultOptions: DropdownListOption[] = [
  { id: '1', label: 'Label', description: 'Description' },
  { id: '2', label: 'Label', description: 'Description' },
  { id: '3', label: 'Label', description: 'Description' },
  { id: '4', label: 'Label', description: 'Description' },
];

export const DropdownList = ({ options = defaultOptions, onSelect }: DropdownListProps) => {
  const resolvedOptions = Array.isArray(options) ? options : defaultOptions;

  return (
    <Root role="menu" aria-label="Dropdown list">
      {resolvedOptions.map((option, index) => (
        <DropdownItem
          key={option.id}
          label={option.label}
          state={option.disabled ? 'disabled' : 'enabled'}
          description={option.description !== undefined}
          {...(option.description !== undefined ? { descriptionText: option.description } : {})}
          {...(option.disabled !== undefined ? { disabled: option.disabled } : {})}
          {...(option.iconBefore !== undefined ? { iconBefore: option.iconBefore } : {})}
          onSelect={() => onSelect?.(option, index)}
        />
      ))}
    </Root>
  );
};
