import { render, screen } from '@testing-library/react';
import { AirplaneTakeoff } from '@phosphor-icons/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';
import { theme } from '@/theme/tokens';

describe('Icon', () => {
  it('renders phosphor icon', () => {
    render(
      <ThemeProvider theme={theme}>
        <Icon icon={AirplaneTakeoff} aria-label="Plane icon" />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText('Plane icon')).toBeInTheDocument();
  });

  it('renders with allowed size', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Icon icon={AirplaneTakeoff} size={16} aria-label="Small plane" />
      </ThemeProvider>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });
});
