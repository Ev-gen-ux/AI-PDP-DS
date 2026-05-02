import styled, { css } from 'styled-components';

export type StatusMarkAppearance = 'success' | 'error' | 'alert' | 'information' | 'wait';

export type StatusMarkSize = 'Extra Extra Small 8px' | 'Extra Small 12px' | 'Small 16px';

export interface StatusMarkProps {
  appearance?: StatusMarkAppearance;
  size?: StatusMarkSize;
  className?: string;
}

const appearanceStyles = {
  success: css`
    background-color: ${({ theme }) => theme.colors.statusMark.background.success.calm.enabled};
  `,
  error: css`
    background-color: ${({ theme }) => theme.colors.statusMark.background.error.calm.enabled};
  `,
  alert: css`
    background-color: ${({ theme }) => theme.colors.statusMark.background.alert.calm.enabled};
  `,
  information: css`
    background-color: ${({ theme }) => theme.colors.statusMark.background.information.calm.enabled};
  `,
  wait: css`
    background-color: ${({ theme }) => theme.colors.statusMark.background.wait.calm.enabled};
  `,
} as const;

const sizeStyles = {
  'Extra Extra Small 8px': css`
    width: ${({ theme }) => theme.spacing.height['3xSmall']};
    height: ${({ theme }) => theme.spacing.height['3xSmall']};
  `,
  'Extra Small 12px': css`
    width: ${({ theme }) => theme.spacing.paddings.compactMedium};
    height: ${({ theme }) => theme.spacing.paddings.compactMedium};
  `,
  'Small 16px': css`
    width: ${({ theme }) => theme.spacing.height['2xSmall']};
    height: ${({ theme }) => theme.spacing.height['2xSmall']};
  `,
} as const;

const successRadiusBySize = {
  'Extra Extra Small 8px': css`
    border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  `,
  'Extra Small 12px': css`
    border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  `,
  'Small 16px': css`
    border-radius: ${({ theme }) => theme.borderRadius.containerBase};
  `,
} as const;

const circleRadius = css`
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
`;

type RootProps = {
  $appearance: StatusMarkAppearance;
  $size: StatusMarkSize;
};

const Root = styled.span<RootProps>`
  display: inline-block;
  box-sizing: border-box;
  flex-shrink: 0;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.statusMark.border.calm.enabled};
  ${({ $appearance }) => appearanceStyles[$appearance]}
  ${({ $size }) => sizeStyles[$size]}
  ${({ $appearance, $size }) =>
    $appearance === 'success' ? successRadiusBySize[$size] : circleRadius}
  ${({ $appearance }) =>
    $appearance === 'success'
      ? css`
          overflow: clip;
        `
      : null}
`;

export const StatusMark = ({
  appearance = 'success',
  size = 'Extra Extra Small 8px',
  className,
}: StatusMarkProps) => {
  return <Root className={className} $appearance={appearance} $size={size} aria-hidden="true" />;
};
