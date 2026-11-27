import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { DropdownList } from './DropdownList';

describe('DropdownList', () => {
  it('renders default items', () => {
    render(
      <ThemeProvider theme={theme}>
        <DropdownList />
      </ThemeProvider>,
    );

    expect(screen.getAllByText('Label')).toHaveLength(4);
  });

  it('calls onSelect with option and index', () => {
    const onSelect = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <DropdownList
          options={[
            { id: 'a', label: 'First', description: 'A' },
            { id: 'b', label: 'Second', description: 'B' },
          ]}
          onSelect={onSelect}
        />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /First/i }));
    expect(onSelect).toHaveBeenCalledWith({ id: 'a', label: 'First', description: 'A' }, 0);
  });
});
