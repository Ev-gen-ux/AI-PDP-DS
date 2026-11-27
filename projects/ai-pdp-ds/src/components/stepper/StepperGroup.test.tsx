import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { StepperGroup } from './StepperGroup';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('StepperGroup', () => {
  it('renders horizontal group with shared footer', () => {
    render(
      <StepperGroup
        orientation="horizontal"
        aria-label="Group horizontal"
        steps={[
          { state: 'completed', heading: 'A', description: 'a' },
          { state: 'active', heading: 'B', description: 'b' },
        ]}
        footerContent={<button type="button">Action</button>}
      />,
      { wrapper },
    );

    expect(screen.getByRole('navigation', { name: 'Group horizontal' })).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('nests vertical slot after nestedContentStepIndex', () => {
    render(
      <StepperGroup
        orientation="vertical"
        aria-label="Group vertical"
        nestedContentStepIndex={0}
        steps={[
          { state: 'completed', heading: 'First', description: 'd1' },
          { state: 'active', heading: 'Second', description: 'd2' },
        ]}
        footerContent={<span>Footer</span>}
      >
        <span>Body</span>
      </StepperGroup>,
      { wrapper },
    );

    const nav = screen.getByRole('navigation', { name: 'Group vertical' });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
