import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { TabItem } from './TabItem';

describe('TabItem', () => {
  it('renders standalone tab with text', () => {
    render(
      <ThemeProvider theme={theme}>
        <TabItem value="x" text="Solo tab" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Solo tab' })).toBeInTheDocument();
  });
});
