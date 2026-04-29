import styled, { css } from 'styled-components';

export type StatusMarkAppearance = 'success';
export type StatusMarkSize = 'Extra Extra Small 8px' | 'Extra Small 12px' | 'Small 16px';

export interface StatusMarkProps {
  appearance?: StatusMarkAppearance;
  size?: StatusMarkSize;
  className?: string;
}

const appearanceStyles = {
  success: css`
    background-color: ${({ theme }) => theme.colors.avatar.statusMark.background.online};
  `,
} as const;

const sizeStyles = {
  'Extra Extra Small 8px': css`
    width: ${({ theme }) => theme.spacing.height['3xSmall']};
    height: ${({ theme }) => theme.spacing.height['3xSmall']};
    border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  `,
  'Extra Small 12px': css`
    width: ${({ theme }) => theme.spacing.paddings.compactMedium};
    height: ${({ theme }) => theme.spacing.paddings.compactMedium};
    border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  `,
  'Small 16px': css`
    width: ${({ theme }) => theme.spacing.height['2xSmall']};
    height: ${({ theme }) => theme.spacing.height['2xSmall']};
    border-radius: ${({ theme }) => theme.borderRadius.containerBase};
  `,
} as const;

const Root = styled.span<{ $appearance: StatusMarkAppearance; $size: StatusMarkSize }>`
  display: inline-block;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.avatar.statusMark.border.calm};
  ${({ $appearance }) => appearanceStyles[$appearance]}
  ${({ $size }) => sizeStyles[$size]}
`;

export const StatusMark = ({
  appearance = 'success',
  size = 'Extra Extra Small 8px',
  className,
}: StatusMarkProps) => {
  return <Root className={className} $appearance={appearance} $size={size} aria-hidden="true" />;
};
