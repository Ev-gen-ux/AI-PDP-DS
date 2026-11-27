import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders initials', () => {
    render(
      <ThemeProvider theme={theme}>
        <Avatar initials="AB" />
      </ThemeProvider>,
    );

    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('can hide status mark', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Avatar showStatusMark={false} />
      </ThemeProvider>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
