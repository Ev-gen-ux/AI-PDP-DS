import type { ButtonHTMLAttributes } from 'react';
import type { ComponentType } from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { styled } from 'styled-components';
import {
  Icon,
  statusErrorIconGlyph,
  statusInformationIconGlyph,
  statusSuccessIconGlyph,
  warningCircleIconGlyph,
  xIconGlyph,
} from '@/components/icon';

export type NotificationSnackbarAppearance = 'success' | 'information' | 'alert' | 'error';

export interface NotificationSnackbarProps {
  appearance?: NotificationSnackbarAppearance;
  title?: string;
  description?: string;
  closable?: boolean;
  onClose?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

type StyledProps = {
  $appearance: NotificationSnackbarAppearance;
};

type GlyphComponent = ComponentType<PhosphorIconProps>;

const appearanceIcons: Record<NotificationSnackbarAppearance, GlyphComponent> = {
  success: statusSuccessIconGlyph,
  information: statusInformationIconGlyph,
  alert: warningCircleIconGlyph,
  error: statusErrorIconGlyph,
};

const Root = styled.div<StyledProps>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  width: 220px;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.paddings.default};
  border-width: 1px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  background-color: ${({ theme, $appearance }) =>
    theme.colors.notification.snackbar.background[$appearance]};
  border-color: ${({ theme, $appearance }) =>
    theme.colors.notification.snackbar.border[$appearance]};
  box-shadow: ${({ theme }) => theme.effects.overlay.notifications};
`;

const IconWrap = styled.span<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme, $appearance }) => theme.colors.notification.snackbar.iconStatus[$appearance]};
`;

const Content = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
  min-width: 0;
`;

const Title = styled.span`
  margin: 0;
  color: ${({ theme }) => theme.colors.notification.snackbar.label.enabled};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
`;

const Description = styled.span`
  margin: 0;
  color: ${({ theme }) => theme.colors.notification.snackbar.description.enabled};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing.height.xSmall};
  height: ${({ theme }) => theme.spacing.height.xSmall};
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.notification.snackbar.buttonClose.enabled};
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
    border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  }
`;

const ICON_SIZE = 24 as const;

export const NotificationSnackbar = ({
  appearance = 'success',
  title = 'Label',
  description = 'Description',
  closable = true,
  onClose,
}: NotificationSnackbarProps) => {
  const appearanceIcon = appearanceIcons[appearance];

  return (
    <Root
      $appearance={appearance}
      role="status"
      aria-live="polite"
      aria-label={`${appearance}: ${title}${description ? `. ${description}` : ''}`}
    >
      <IconWrap $appearance={appearance}>
        <Icon icon={appearanceIcon} size={ICON_SIZE} weight="fill" aria-hidden="true" />
      </IconWrap>
      <Content>
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
      </Content>
      {closable ? (
        <CloseButton type="button" aria-label="Close notification" onClick={onClose}>
          <Icon icon={xIconGlyph} size={ICON_SIZE} aria-hidden="true" />
        </CloseButton>
      ) : null}
    </Root>
  );
};
