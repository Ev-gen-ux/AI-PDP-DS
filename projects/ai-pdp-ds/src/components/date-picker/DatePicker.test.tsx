import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { DatePicker } from './DatePicker';

const wrap = (ui: ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>;

describe('DatePicker', () => {
  it('renders month title and weekday row', () => {
    render(
      wrap(
        <DatePicker
          year={2025}
          monthIndex={8}
          locale="en-US"
          weekStartsOn={1}
          onMonthPrev={() => undefined}
          onMonthNext={() => undefined}
        />,
      ),
    );
    expect(screen.getByText(/September 2025/i)).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('capitalizes Russian month title (Сентябрь, not сентябрь)', () => {
    render(
      wrap(
        <DatePicker
          year={2025}
          monthIndex={8}
          locale="ru-RU"
          weekStartsOn={1}
          onMonthPrev={() => undefined}
          onMonthNext={() => undefined}
        />,
      ),
    );
    expect(screen.getByText(/Сентябрь 2025/)).toBeInTheDocument();
  });

  it('shows month abbrev in first grid row when month starts after Monday (Figma lead row)', () => {
    render(
      wrap(
        <DatePicker
          year={2025}
          monthIndex={9}
          locale="ru-RU"
          weekStartsOn={1}
          onMonthPrev={() => undefined}
          onMonthNext={() => undefined}
        />,
      ),
    );
    expect(screen.getByText('Окт')).toBeInTheDocument();
  });

  it('renders Russian weekday labels with leading capital (Пт, not duplicate Пн)', () => {
    render(
      wrap(
        <DatePicker
          year={2025}
          monthIndex={8}
          locale="ru-RU"
          weekStartsOn={1}
          onMonthPrev={() => undefined}
          onMonthNext={() => undefined}
        />,
      ),
    );
    expect(screen.getByText('Пт')).toBeInTheDocument();
    expect(screen.getByText('Пн')).toBeInTheDocument();
  });

  it('calls onMonthPrev and onMonthNext', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(
      wrap(
        <DatePicker
          year={2025}
          monthIndex={8}
          locale="en-US"
          weekStartsOn={1}
          onMonthPrev={onPrev}
          onMonthNext={onNext}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Предыдущий месяц' }));
    await user.click(screen.getByRole('button', { name: 'Следующий месяц' }));
    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectDate when a day in month is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      wrap(
        <DatePicker
          year={2025}
          monthIndex={8}
          locale="en-US"
          weekStartsOn={1}
          onMonthPrev={() => undefined}
          onMonthNext={() => undefined}
          onSelectDate={onSelect}
        />,
      ),
    );
    const grid = screen.getByRole('grid');
    await user.click(within(grid).getByRole('button', { name: /September 15, 2025/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const picked = onSelect.mock.calls[0]?.[0];
    expect(picked).toBeDefined();
    expect(picked?.getFullYear()).toBe(2025);
    expect(picked?.getMonth()).toBe(8);
    expect(picked?.getDate()).toBe(15);
  });
});
