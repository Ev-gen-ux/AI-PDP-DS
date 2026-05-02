import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { InputDate } from './InputDate';
import { theme } from '@/theme/tokens';

describe('InputDate', () => {
  it('renders date input and label', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputDate label="Due date" placeholder="YYYY-MM-DD" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Due date')).toBeInTheDocument();
    expect(screen.getByLabelText('Due date')).toHaveAttribute('type', 'date');
    expect(screen.getByText('YYYY-MM-DD')).toBeInTheDocument();
  });

  it('sets aria-invalid when invalid is true', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputDate label="End" invalid defaultValue="2024-01-01" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('End')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error message and hides help message when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputDate label="End" invalid helpMessage="Help message" errorMessage="Error message" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Help message')).not.toBeInTheDocument();
  });

  it('calls showPicker when calendar button is clicked', () => {
    const showPicker = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <InputDate label="Start" defaultValue="" />
      </ThemeProvider>,
    );

    const input = screen.getByLabelText('Start') as HTMLInputElement;
    input.showPicker = showPicker;

    fireEvent.click(screen.getByRole('button', { name: 'Open date picker' }));
    expect(showPicker).toHaveBeenCalledTimes(1);
  });
});
