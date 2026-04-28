import styled, { css } from 'styled-components';

export type InlineMessageStatus = 'default' | 'error';

export interface InlineMessageProps {
  id?: string;
  message: string;
  status?: InlineMessageStatus;
}

const statusStyles = {
  default: css`
    color: ${({ theme }) => theme.colors.input.inlineMessage.default};
  `,
  error: css`
    color: ${({ theme }) => theme.colors.input.inlineMessage.error};
  `,
} as const;

const Root = styled.div<{ $status: InlineMessageStatus }>`
  display: flex;
  align-items: center;
  width: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  ${({ $status }) => statusStyles[$status]}
`;

export const InlineMessage = ({ id, message, status = 'default' }: InlineMessageProps) => {
  return (
    <Root id={id} $status={status}>
      {message}
    </Root>
  );
};
