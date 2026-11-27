import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from './FileUpload';
import { theme } from '@/theme/tokens';

describe('FileUpload', () => {
  it('renders file name and size', () => {
    render(
      <ThemeProvider theme={theme}>
        <FileUpload fileName="doc.pdf" fileSizeLabel="12 (KB)" onRemove={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    expect(screen.getByText('12 (KB)')).toBeInTheDocument();
  });

  it('calls onRemove when trash is clicked', () => {
    const onRemove = vi.fn();
    render(
      <ThemeProvider theme={theme}>
        <FileUpload fileName="a.txt" onRemove={onRemove} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Remove a\.txt/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('shows error message when status is error', () => {
    render(
      <ThemeProvider theme={theme}>
        <FileUpload
          fileName="x.bin"
          status="error"
          errorMessage="Upload failed"
          onRemove={() => undefined}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('shows spinner when uploading', () => {
    render(
      <ThemeProvider theme={theme}>
        <FileUpload fileName="big.zip" status="uploading" onRemove={() => undefined} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('status', { name: 'Uploading' })).toBeInTheDocument();
  });
});
