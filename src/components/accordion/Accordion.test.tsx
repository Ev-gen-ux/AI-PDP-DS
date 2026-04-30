import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders title', () => {
    render(
      <ThemeProvider theme={theme}>
        <Accordion title="Heading" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Heading')).toBeInTheDocument();
  });

  it('toggles body visibility', () => {
    render(
      <ThemeProvider theme={theme}>
        <Accordion title="Heading" />
      </ThemeProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Collapse section' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand section' }));
    expect(screen.getByRole('button', { name: 'Collapse section' })).toBeInTheDocument();
  });
});
