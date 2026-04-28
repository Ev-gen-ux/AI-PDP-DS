import styled from 'styled-components';

export type LabelState = 'default' | 'disabled' | 'readOnly';

export interface LabelProps {
  htmlFor?: string;
  text?: string;
  required?: boolean;
  state?: LabelState;
}

const Root = styled.label<{ $state: LabelState }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.closest};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme, $state }) => {
    if ($state === 'disabled') return theme.colors.input.label.disabled;
    if ($state === 'readOnly') return theme.colors.input.label.readOnly;
    return theme.colors.input.label.enabled;
  }};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.input.required.enabled};
`;

export const Label = ({
  htmlFor,
  text = 'Label',
  required = false,
  state = 'default',
}: LabelProps) => {
  return (
    <Root htmlFor={htmlFor} $state={state}>
      {text}
      {required ? <RequiredMark aria-hidden="true">*</RequiredMark> : null}
    </Root>
  );
};
