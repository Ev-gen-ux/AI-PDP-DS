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
});
