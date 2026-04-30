import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { DropdownItem } from './DropdownItem';

describe('DropdownItem', () => {
  it('renders label and description', () => {
    render(
      <ThemeProvider theme={theme}>
        <DropdownItem label="Label" description="Description" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('calls onSelect on click', () => {
    const onSelect = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <DropdownItem label="Label" description="Description" onSelect={onSelect} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('disables click interaction when disabled', () => {
    const onSelect = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <DropdownItem state="disabled" disabled onSelect={onSelect} />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
