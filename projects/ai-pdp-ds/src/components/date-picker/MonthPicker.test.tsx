import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { MonthPicker } from './MonthPicker';

const wrap = (ui: ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;

describe('MonthPicker', () => {
  it('renders range label and month abbreviations in Russian', () => {
    render(
      wrap(
        <MonthPicker
          year={2023}
          rangeLabel="2001–2023"
          selectedMonthIndex={5}
          locale="ru-RU"
          onSelectMonth={() => undefined}
        />,
      ),
    );
    expect(screen.getByText('2001–2023')).toBeInTheDocument();
    expect(screen.getByText('Июн')).toBeInTheDocument();
    expect(screen.getByText('Янв')).toBeInTheDocument();
  });

  it('calls onSelectMonth with month index', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      wrap(
        <MonthPicker year={2023} rangeLabel="2001–2023" locale="ru-RU" onSelectMonth={onSelect} />,
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Мар' }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
