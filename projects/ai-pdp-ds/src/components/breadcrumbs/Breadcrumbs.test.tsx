import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders default breadcrumb labels', () => {
    render(
      <ThemeProvider theme={theme}>
        <Breadcrumbs />
      </ThemeProvider>,
    );

    expect(screen.getByText('root')).toBeInTheDocument();
    expect(screen.getByText('current')).toBeInTheDocument();
  });

  it('calls onItemClick for actionable item', () => {
    const onItemClick = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <Breadcrumbs
          items={[
            { type: 'item', label: 'root' },
            { type: 'item', label: 'current', current: true, state: 'current' },
          ]}
          onItemClick={onItemClick}
        />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'root' }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });
});
