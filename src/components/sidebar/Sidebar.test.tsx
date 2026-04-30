import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders default state with expected width', () => {
    render(
      <ThemeProvider theme={theme}>
        <Sidebar state="default" />
      </ThemeProvider>,
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveStyle('width: 280px');
  });

  it('renders collapse state with expected width', () => {
    render(
      <ThemeProvider theme={theme}>
        <Sidebar state="collapse" />
      </ThemeProvider>,
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveStyle('width: 88px');
  });

  it('renders custom slots', () => {
    render(
      <ThemeProvider theme={theme}>
        <Sidebar
          contentHeaderSlot={<span>Header Slot</span>}
          contentBodySlot={<span>Body Slot</span>}
          contentFooterSlot={<span>Footer Slot</span>}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Header Slot')).toBeInTheDocument();
    expect(screen.getByText('Body Slot')).toBeInTheDocument();
    expect(screen.getByText('Footer Slot')).toBeInTheDocument();
  });
});
