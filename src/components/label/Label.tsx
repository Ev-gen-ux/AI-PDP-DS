import styled from 'styled-components';

export type LabelState = 'default' | 'disabled' | 'readOnly';

export interface LabelProps {
  htmlFor?: string;
  text?: string;
  required?: boolean;
  state?: LabelState;
  /**
   * Семантика цветов лейбла: общая `input` или `inputText` (Figma `inputtext/label`, `inputtext/required`).
   * По умолчанию `input` — для полей Date, Search и др.
   */
  colorGroup?: 'input' | 'inputText';
}

type LabelStyledProps = { $state: LabelState; $colorGroup: 'input' | 'inputText' };

const Root = styled.label<LabelStyledProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.closest};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme, $state, $colorGroup }) => {
    const labelTokens =
      $colorGroup === 'inputText' ? theme.colors.inputText.label : theme.colors.input.label;
    if ($state === 'disabled') return labelTokens.disabled;
    if ($state === 'readOnly') return labelTokens.readOnly;
    return labelTokens.enabled;
  }};
`;

const RequiredMark = styled.span<{ $colorGroup: 'input' | 'inputText' }>`
  color: ${({ theme, $colorGroup }) =>
    $colorGroup === 'inputText'
      ? theme.colors.inputText.required.enabled
      : theme.colors.input.required.enabled};
`;

export const Label = ({
  htmlFor,
  text = 'Label',
  required = false,
  state = 'default',
  colorGroup = 'input',
}: LabelProps) => {
  return (
    <Root htmlFor={htmlFor} $state={state} $colorGroup={colorGroup}>
      {text}
      {required ? (
        <RequiredMark aria-hidden="true" $colorGroup={colorGroup}>
          *
        </RequiredMark>
      ) : null}
    </Root>
  );
};
