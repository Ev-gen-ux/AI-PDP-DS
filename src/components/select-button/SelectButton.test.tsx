import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { SelectButton } from './SelectButton';

describe('SelectButton', () => {
  it('renders selected option label', () => {
    render(
      <ThemeProvider theme={theme}>
        <SelectButton
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
          ]}
          value="b"
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument();
  });

  it('opens list and calls onValueChange on option pick', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <SelectButton
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
          ]}
          onValueChange={onValueChange}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Alpha' }));
    await user.click(screen.getByRole('option', { name: 'Beta' }));

    expect(onValueChange).toHaveBeenCalledWith('b', { value: 'b', label: 'Beta' });
    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument();
  });
});
