import type { ComponentType } from 'react';
import styled, { css } from 'styled-components';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import {
  Icon,
  fileXlsIconGlyph,
  statusErrorIconGlyph,
  trashSimpleIconGlyph,
} from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { Spinner } from '@/components/spinner';

export type FileUploadStatus = 'success' | 'uploading' | 'error';

type GlyphComponent = ComponentType<PhosphorIconProps>;

export interface FileUploadProps {
  /** Имя файла (видимый текст) */
  fileName: string;
  /** Подпись размера справа от имени, например «16 (KB)» */
  fileSizeLabel?: string;
  status?: FileUploadStatus;
  /** Сообщение под карточкой при status=error */
  errorMessage?: string;
  onRemove?: () => void;
  /** Иконка слева (по умолчанию Figma FileXls; при error — XCircle) */
  fileIcon?: GlyphComponent;
  className?: string;
}

type CardProps = {
  $status: FileUploadStatus;
};

const borderStyles = {
  success: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.success};
  `,
  uploading: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.enabled};
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.error};
  `,
} as const;

const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.related};
  width: 100%;
`;

const CardRow = styled.div<CardProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-height: ${({ theme }) => theme.spacing.height.large};
  box-sizing: border-box;
  padding: 0 ${({ theme }) => theme.spacing.paddings.default};
  border-width: 1px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  background-color: ${({ theme }) => theme.colors.inputFile.background.enabled};
  transition: border-color 0.15s ease;
  ${({ $status }) => borderStyles[$status]}
`;

const LeadIconWrap = styled.span<{ $error: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ theme, $error }) =>
    $error ? theme.colors.inputFile.icon.error : theme.colors.inputFile.icon.enabled};
`;

const FileNameText = styled.span`
  flex-shrink: 0;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.inputFile.textPlaceholderValue.enabled};
`;

const FileMetaText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.inputFile.textPlaceholder.enabled};
`;

const TrashButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: transparent;
  color: ${({ theme }) => theme.colors.inputFile.icon.loud.enabled};
  cursor: pointer;
  transition:
    color 0.15s ease,
    opacity 0.15s ease;

  &:focus-visible {
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SpinnerWrap = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
`;

export const FileUpload = ({
  fileName,
  fileSizeLabel,
  status = 'success',
  errorMessage,
  onRemove,
  fileIcon,
  className,
}: FileUploadProps) => {
  const showSpinner = status === 'uploading';
  const isError = status === 'error';
  const LeadingIcon = isError ? statusErrorIconGlyph : (fileIcon ?? fileXlsIconGlyph);

  return (
    <Card className={className} $status={status}>
      <CardRow $status={status}>
        <LeadIconWrap $error={isError}>
          <Icon icon={LeadingIcon} size={24} />
        </LeadIconWrap>
        <FileNameText title={fileName}>{fileName}</FileNameText>
        {fileSizeLabel ? (
          <FileMetaText>{fileSizeLabel}</FileMetaText>
        ) : (
          <FileMetaText aria-hidden />
        )}
        {showSpinner ? (
          <SpinnerWrap>
            <Spinner size={16} aria-label="Uploading" />
          </SpinnerWrap>
        ) : null}
        <TrashButton
          type="button"
          aria-label={`Remove ${fileName}`}
          onClick={onRemove}
          disabled={!onRemove}
        >
          <Icon icon={trashSimpleIconGlyph} size={24} />
        </TrashButton>
      </CardRow>
      {isError && errorMessage ? <InlineMessage message={errorMessage} status="error" /> : null}
    </Card>
  );
};
