import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { YearPicker } from './YearPicker';

const wrap = (ui: ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;

const twelve = Array.from({ length: 12 }, (_, i) => 2012 + i);

describe('YearPicker', () => {
  it('renders range label and year grid', () => {
    render(
      wrap(
        <YearPicker
          rangeLabel="2001–2023"
          leadYear={2023}
          years={twelve}
          selectedYear={2023}
          onSelectYear={() => undefined}
        />,
      ),
    );
    expect(screen.getByText('2001–2023')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2023' })).toBeInTheDocument();
  });

  it('calls onSelectYear when a year is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      wrap(
        <YearPicker
          rangeLabel="2001–2023"
          leadYear={2023}
          years={twelve}
          onSelectYear={onSelect}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: '2015' }));
    expect(onSelect).toHaveBeenCalledWith(2015);
  });
});
