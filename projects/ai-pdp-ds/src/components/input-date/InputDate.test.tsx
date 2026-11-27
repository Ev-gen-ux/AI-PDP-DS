import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
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

  it('hides custom placeholder while the date input is focused', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputDate label="Start" placeholder="дд.мм.гггг" defaultValue="" />
      </ThemeProvider>,
    );

    expect(screen.getByText('дд.мм.гггг')).toBeInTheDocument();
    fireEvent.focus(screen.getByLabelText('Start'));
    expect(screen.queryByText('дд.мм.гггг')).not.toBeInTheDocument();
    fireEvent.blur(screen.getByLabelText('Start'));
    expect(screen.getByText('дд.мм.гггг')).toBeInTheDocument();
  });

  it('opens custom calendar popover when calendar button is clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputDate label="Start" defaultValue="" />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open date picker' }));
    expect(screen.getByRole('application', { name: 'Календарь' })).toBeInTheDocument();
  });
});
