import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/theme/tokens';
import { TableColumn } from './table-column';
import { TableRow } from './table-row';

describe('Table', () => {
  it('renders row and column variants', () => {
    render(
      <ThemeProvider theme={theme}>
        <div>
          <TableRow />
          <TableColumn />
        </div>
      </ThemeProvider>,
    );

    expect(screen.getAllByText('textContent').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Status Label').length).toBeGreaterThan(0);
  });
});
