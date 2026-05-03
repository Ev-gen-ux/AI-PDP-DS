import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { Stepper } from './Stepper';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('Stepper', () => {
  it('renders horizontal steps and marks active step', () => {
    render(
      <Stepper
        aria-label="Test steps"
        items={[
          {
            state: 'completed',
            heading: 'One',
            description: 'Done',
            body: false,
            footer: false,
          },
          {
            state: 'active',
            heading: 'Two',
            description: 'Current',
            body: false,
            footer: false,
          },
          {
            state: 'disabled',
            heading: 'Three',
            description: 'Later',
            body: false,
            footer: false,
          },
        ]}
      />,
      { wrapper },
    );

    const nav = screen.getByRole('navigation', { name: 'Test steps' });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();

    const current = screen.getByRole('listitem', { current: 'step' });
    expect(current).toHaveTextContent('Two');
  });

  it('sets aria-invalid when active step has invalid true', () => {
    render(
      <Stepper
        aria-label="Invalid step"
        items={[{ state: 'active', invalid: true, heading: 'Bad', description: 'Err' }]}
      />,
      { wrapper },
    );

    expect(screen.getByRole('listitem', { current: 'step' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('hides description when paragraph is false', () => {
    render(
      <Stepper
        aria-label="No paragraph"
        items={[
          {
            state: 'active',
            heading: 'Title',
            paragraph: false,
            description: 'Hidden text',
            body: false,
            footer: false,
          },
        ]}
      />,
      { wrapper },
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.queryByText('Hidden text')).not.toBeInTheDocument();
  });

  it('renders vertical orientation', () => {
    render(
      <Stepper
        orientation="vertical"
        aria-label="Vertical"
        items={[
          {
            state: 'active',
            heading: 'Only',
            description: 'Step',
            body: false,
            footer: false,
          },
        ]}
      />,
      { wrapper },
    );

    expect(screen.getByRole('navigation', { name: 'Vertical' })).toBeInTheDocument();
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  it('marks state invalid as current and aria-invalid', () => {
    render(
      <Stepper
        aria-label="Invalid state"
        items={[{ state: 'invalid', heading: 'Err step', description: 'Fix' }]}
      />,
      { wrapper },
    );

    const li = screen.getByRole('listitem', { current: 'step' });
    expect(li).toHaveTextContent('Err step');
    expect(li).toHaveAttribute('aria-invalid', 'true');
  });
});
