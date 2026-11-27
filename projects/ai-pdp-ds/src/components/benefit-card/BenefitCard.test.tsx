import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { BenefitCard } from './BenefitCard';

describe('BenefitCard', () => {
  it('renders heading, description and actions', () => {
    render(
      <ThemeProvider theme={theme}>
        <BenefitCard />
      </ThemeProvider>,
    );

    expect(screen.getByText('Benefit Heading')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Button Label' })).toHaveLength(2);
  });

  it('handles button click callbacks', () => {
    const onPrimaryClick = vi.fn();
    const onOutlineClick = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <BenefitCard onPrimaryClick={onPrimaryClick} onOutlineClick={onOutlineClick} />
      </ThemeProvider>,
    );

    const buttons = screen.getAllByRole('button', { name: 'Button Label' });
    const primaryButton = buttons[0];
    const outlineButton = buttons[1];
    expect(primaryButton).toBeDefined();
    expect(outlineButton).toBeDefined();
    if (!primaryButton || !outlineButton) {
      throw new Error('Expected both primary and outline buttons');
    }
    fireEvent.click(primaryButton);
    fireEvent.click(outlineButton);

    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
    expect(onOutlineClick).toHaveBeenCalledTimes(1);
  });

  it('hides optional blocks when props are disabled', () => {
    render(
      <ThemeProvider theme={theme}>
        <BenefitCard
          hasIcon={false}
          hasLabel={false}
          hasButtonPrimary={false}
          hasButtonOutline={false}
          childrenBody={false}
          contentBefore={false}
          contentAfter={false}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Button Label' })).toBeNull();
    expect(screen.queryByText('Status Label')).toBeNull();
  });
});
