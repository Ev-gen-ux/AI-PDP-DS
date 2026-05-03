import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { InputFile } from './InputFile';
import { theme } from '@/theme/tokens';

describe('InputFile', () => {
  it('renders label and associates file input', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputFile label="Files" />
      </ThemeProvider>,
    );
    const input = screen.getByLabelText('Files');
    expect(input).toHaveAttribute('type', 'file');
  });

  it('fires onFilesSelected when user picks files', () => {
    const onFilesSelected = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <InputFile label="Upload" onFilesSelected={onFilesSelected} />
      </ThemeProvider>,
    );
    const input = screen.getByLabelText('Upload') as HTMLInputElement;
    const file = new File(['x'], 'hello.txt', { type: 'text/plain' });
    const list = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    } as unknown as FileList;
    Object.defineProperty(input, 'files', { value: list, configurable: true });
    fireEvent.change(input);
    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    const firstCall = onFilesSelected.mock.calls[0]?.[0];
    expect(firstCall?.item(0)).toBe(file);
  });

  it('sets aria-invalid when invalid', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputFile label="Doc" invalid errorMessage="Required" />
      </ThemeProvider>,
    );
    expect(screen.getByLabelText('Doc')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('renders file cards for items', () => {
    render(
      <ThemeProvider theme={theme}>
        <InputFile
          label="Attachments"
          items={[{ id: '1', fileName: 'a.png', fileSizeLabel: '1 (KB)', status: 'success' }]}
          onRemoveItem={() => undefined}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText('a.png')).toBeInTheDocument();
  });
});
