import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { InlineMessage } from './InlineMessage';
import { theme } from '@/theme/tokens';

describe('InlineMessage', () => {
  it('renders message text', () => {
    render(
      <ThemeProvider theme={theme}>
        <InlineMessage message="Help message" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Help message')).toBeInTheDocument();
  });

  it('renders error variant', () => {
    render(
      <ThemeProvider theme={theme}>
        <InlineMessage status="error" message="Error message" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
