import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '@/theme/tokens';
import { TabItem } from '@/components/tab-item';
import { TabGroup } from './TabGroup';

describe('TabGroup', () => {
  it('selects tab on click and calls onValueChange', () => {
    const onValueChange = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <TabGroup value="a" onValueChange={onValueChange}>
          <TabItem value="a" text="A" />
          <TabItem value="b" text="B" />
        </TabGroup>
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('moves selection with ArrowRight', () => {
    const onValueChange = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <TabGroup value="a" onValueChange={onValueChange}>
          <TabItem value="a" text="A" />
          <TabItem value="b" text="B" />
        </TabGroup>
      </ThemeProvider>,
    );

    const first = screen.getByRole('tab', { name: 'A' });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});
