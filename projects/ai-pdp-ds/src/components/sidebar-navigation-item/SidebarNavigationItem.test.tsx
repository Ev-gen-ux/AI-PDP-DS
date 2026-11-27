import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/theme/tokens';
import { SidebarNavigationItem } from './SidebarNavigationItem';

describe('SidebarNavigationItem', () => {
  it('renders default label', () => {
    render(
      <ThemeProvider theme={theme}>
        <SidebarNavigationItem />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Nav Label' })).toBeInTheDocument();
  });

  it('sets aria-current on active state', () => {
    render(
      <ThemeProvider theme={theme}>
        <SidebarNavigationItem state="active" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });

  it('hides label when label=false', () => {
    render(
      <ThemeProvider theme={theme}>
        <SidebarNavigationItem label={false} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByText('Nav Label')).toBeNull();
  });

  it('always renders icon', () => {
    render(
      <ThemeProvider theme={theme}>
        <SidebarNavigationItem />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button').querySelector('svg')).not.toBeNull();
  });
});
