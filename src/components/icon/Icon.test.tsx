import { render, screen } from '@testing-library/react';
import { AirplaneTakeoffIcon } from '@phosphor-icons/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';
import { theme } from '@/theme/tokens';

describe('Icon', () => {
  it('renders phosphor icon', () => {
    render(
      <ThemeProvider theme={theme}>
        <Icon icon={AirplaneTakeoffIcon} aria-label="Plane icon" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Plane icon')).toBeInTheDocument();
  });

  it('renders with allowed size', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Icon icon={AirplaneTakeoffIcon} size={16} aria-label="Small plane" />
      </ThemeProvider>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });
});
