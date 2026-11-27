import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { StatusMark } from './StatusMark';

describe('StatusMark', () => {
  it('renders with requested size', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <StatusMark size="Small 16px" />
      </ThemeProvider>,
    );

    const mark = container.querySelector('span');
    expect(mark).toBeInTheDocument();
  });

  it('renders non-success appearance', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <StatusMark appearance="error" size="Extra Small 12px" />
      </ThemeProvider>,
    );

    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
