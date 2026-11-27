import { type IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import type { ComponentType } from 'react';
import { styled, css } from 'styled-components';
import {
  Icon,
  statusAlertIconGlyph,
  statusErrorIconGlyph,
  statusInformationIconGlyph,
  statusSuccessIconGlyph,
  statusWaitIconGlyph,
} from '@/components/icon';

export type StatusLabelAppearance = 'primary' | 'secondary';
export type StatusLabelStatus = 'success' | 'information' | 'alert' | 'wait' | 'error';
export type StatusLabelSize = 'medium' | 'small';

export interface StatusLabelProps {
  text: string;
  status?: StatusLabelStatus;
  appearance?: StatusLabelAppearance;
  size?: StatusLabelSize;
  withIcon?: boolean;
}

type StyledProps = {
  $appearance: StatusLabelAppearance;
  $status: StatusLabelStatus;
  $size: StatusLabelSize;
};

type GlyphComponent = ComponentType<PhosphorIconProps>;

const statusIcons: Record<StatusLabelStatus, GlyphComponent> = {
  success: statusSuccessIconGlyph,
  information: statusInformationIconGlyph,
  alert: statusAlertIconGlyph,
  wait: statusWaitIconGlyph,
  error: statusErrorIconGlyph,
};

const appearanceStyles = {
  primary: css<StyledProps>`
    border: 1px solid transparent;
    background-color: ${({ theme, $status }) =>
      theme.colors.labelStatus.primary.background[$status]};
    color: ${({ theme }) => theme.colors.labelStatus.primary.label.enabled};
  `,
  secondary: css<StyledProps>`
    background-color: ${({ theme, $status }) =>
      theme.colors.labelStatus.secondary.background[$status]};
    border: 1px solid ${({ theme, $status }) => theme.colors.labelStatus.secondary.border[$status]};
    color: ${({ theme, $status }) => theme.colors.labelStatus.secondary.label[$status]};
  `,
} as const;

const sizeStyles = {
  medium: css`
    gap: ${({ theme }) => theme.spacing.inner.related};
    padding: ${({ theme }) => theme.spacing.paddings.xsCompact}
      ${({ theme }) => theme.spacing.paddings.compactMedium};
    border-radius: ${({ theme }) => theme.borderRadius.componentBase};
    font-size: ${({ theme }) => theme.typography.fontSize.component.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  `,
  small: css`
    gap: ${({ theme }) => theme.spacing.inner.close};
    padding: ${({ theme }) => theme.spacing.paddings.xxsCompact}
      ${({ theme }) => theme.spacing.paddings.xsCompact};
    border-radius: ${({ theme }) => theme.borderRadius.componentInner};
    font-size: ${({ theme }) => theme.typography.fontSize.component.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  `,
} as const;

const Root = styled.span<StyledProps>`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  white-space: nowrap;
  ${({ $appearance }) => appearanceStyles[$appearance]}
  ${({ $size }) => sizeStyles[$size]}
`;

const LabelText = styled.span`
  display: inline-flex;
  align-items: center;
`;

const IconWrap = styled.span<StyledProps>`
  display: inline-flex;
  color: ${({ theme, $appearance, $status }) =>
    $appearance === 'primary'
      ? theme.colors.labelStatus.primary.icon.enabled
      : theme.colors.labelStatus.secondary.icon[$status]};
`;

export const StatusLabel = ({
  text,
  status = 'success',
  appearance = 'secondary',
  size = 'medium',
  withIcon = true,
}: StatusLabelProps) => {
  const icon = statusIcons[status];

  return (
    <Root
      $appearance={appearance}
      $status={status}
      $size={size}
      role="status"
      aria-label={`${status}: ${text}`}
    >
      {withIcon ? (
        <IconWrap $appearance={appearance} $status={status} $size={size}>
          <Icon icon={icon} size={16} aria-hidden="true" />
        </IconWrap>
      ) : null}
      <LabelText>{text}</LabelText>
    </Root>
  );
};
