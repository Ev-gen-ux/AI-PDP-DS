import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { FileUpload, type FileUploadStatus } from '../file-upload';
import { Icon, uploadSimpleIconGlyph } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { Label } from '@/components/label';

export interface InputFileItem {
  id: string;
  fileName: string;
  fileSizeLabel?: string;
  status: FileUploadStatus;
  errorMessage?: string;
}

export interface InputFileProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value' | 'defaultValue' | 'onChange'
> {
  label?: string;
  actionLabel?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  helpMessage?: string;
  errorMessage?: string;
  items?: InputFileItem[];
  defaultItems?: InputFileItem[];
  onItemsChange?: (items: InputFileItem[]) => void;
  /** Выбор файлов в системном диалоге */
  onFilesSelected?: (files: FileList) => void;
  onRemoveItem?: (id: string) => void;
}

type FieldState = 'enabled' | 'hover' | 'focus' | 'disabled' | 'error' | 'success';

type FieldProps = {
  $state: FieldState;
};

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.related};
  width: 100%;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compact};
  width: 100%;
`;

const stateStyles = {
  enabled: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.enabled};
  `,
  hover: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.hover};
  `,
  focus: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.focus};
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  `,
  disabled: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.disabled};
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.error};
  `,
  success: css`
    border-color: ${({ theme }) => theme.colors.inputFile.border.success};
  `,
} as const;

const Field = styled.label<FieldProps>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-height: ${({ theme }) => theme.spacing.height.large};
  border-width: 1px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  padding: 0 ${({ theme }) => theme.spacing.paddings.default};
  box-sizing: border-box;
  background-color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.inputFile.background.disabled
      : theme.colors.inputFile.background.enabled};
  cursor: ${({ $state }) => ($state === 'disabled' ? 'not-allowed' : 'pointer')};
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
  ${({ $state }) => stateStyles[$state]}
`;

const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const UploadIconWrap = styled.span<{ $disabled: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.inputFile.icon.disabled : theme.colors.inputFile.icon.enabled};
`;

const ActionText = styled.span<{ $disabled: boolean }>`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.linkButton.primary.label.disabled
      : theme.colors.linkButton.primary.label.enabled};
`;

const PlaceholderText = styled.span<{ $disabled: boolean }>`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.inputFile.textPlaceholder.disabled
      : theme.colors.inputFile.textPlaceholder.enabled};
`;

const FileStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.related};
  width: 100%;
`;

const resolveFieldState = (params: {
  disabled: boolean;
  invalid: boolean;
  success: boolean;
  focused: boolean;
  hovered: boolean;
}): FieldState => {
  const { disabled, invalid, success, focused, hovered } = params;
  if (disabled) return 'disabled';
  if (invalid) return 'error';
  if (focused) return 'focus';
  if (hovered) return 'hover';
  if (success) return 'success';
  return 'enabled';
};

export const InputFile = ({
  id,
  name,
  label = 'Label',
  actionLabel = 'Action',
  placeholder = 'Placeholder',
  required = false,
  disabled = false,
  invalid = false,
  success = false,
  helpMessage,
  errorMessage,
  items: itemsProp,
  defaultItems = [],
  onItemsChange,
  onFilesSelected,
  onRemoveItem,
  multiple,
  accept,
  ...rest
}: InputFileProps) => {
  const reactId = useId();
  const inputId = id ?? `input-file-${reactId}`;
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledItems, setUncontrolledItems] = useState<InputFileItem[]>(defaultItems);

  const isControlled = itemsProp !== undefined;
  const items = isControlled ? itemsProp : uncontrolledItems;

  const fieldState = useMemo(
    () =>
      resolveFieldState({
        disabled,
        invalid,
        success,
        focused,
        hovered,
      }),
    [disabled, invalid, success, focused, hovered],
  );

  const hasErrorMessage = invalid && Boolean(errorMessage);
  const hasHelpMessage = !hasErrorMessage && Boolean(helpMessage);
  const describedBy = hasErrorMessage || hasHelpMessage ? messageId : undefined;

  const handleNativeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const list = event.target.files;
    if (list && list.length > 0) {
      onFilesSelected?.(list);
    }
    event.target.value = '';
  };

  const handleRemove = (itemId: string) => {
    const next = items.filter((i) => i.id !== itemId);
    if (!isControlled) {
      setUncontrolledItems(next);
    }
    onItemsChange?.(next);
    onRemoveItem?.(itemId);
  };

  return (
    <Outer>
      <Inner>
        <Label
          htmlFor={inputId}
          text={label}
          required={required}
          state={disabled ? 'disabled' : 'default'}
        />
        <Field
          htmlFor={inputId}
          $state={fieldState}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <HiddenFileInput
            {...rest}
            id={inputId}
            ref={inputRef}
            name={name}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={handleNativeChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <UploadIconWrap $disabled={disabled} aria-hidden>
            <Icon icon={uploadSimpleIconGlyph} size={24} />
          </UploadIconWrap>
          <ActionText $disabled={disabled}>{actionLabel}</ActionText>
          <PlaceholderText $disabled={disabled}>{placeholder}</PlaceholderText>
        </Field>
        {hasErrorMessage ? (
          <InlineMessage id={messageId} message={errorMessage as string} status="error" />
        ) : null}
        {hasHelpMessage ? <InlineMessage id={messageId} message={helpMessage as string} /> : null}
      </Inner>
      {items.length > 0 ? (
        <FileStack>
          {items.map((item) => (
            <FileUpload
              key={item.id}
              fileName={item.fileName}
              {...(item.fileSizeLabel !== undefined ? { fileSizeLabel: item.fileSizeLabel } : {})}
              status={item.status}
              {...(item.errorMessage !== undefined ? { errorMessage: item.errorMessage } : {})}
              {...(disabled ? {} : { onRemove: () => handleRemove(item.id) })}
            />
          ))}
        </FileStack>
      ) : null}
    </Outer>
  );
};
