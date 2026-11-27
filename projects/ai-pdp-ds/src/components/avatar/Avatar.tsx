import { styled, css } from 'styled-components';
import { StatusMark } from '@/components/status-mark';

export type AvatarState = 'enabled' | 'hover' | 'active';

export interface AvatarProps {
  initials?: string;
  state?: AvatarState;
  showStatusMark?: boolean;
}

const stateStyles = {
  enabled: css`
    background-color: ${({ theme }) => theme.colors.avatar.background.enabled};
    color: ${({ theme }) => theme.colors.avatar.label.default};
  `,
  hover: css`
    background-color: ${({ theme }) => theme.colors.avatar.background.hover};
    color: ${({ theme }) => theme.colors.avatar.label.hover};
  `,
  active: css`
    background-color: ${({ theme }) => theme.colors.avatar.background.active};
    color: ${({ theme }) => theme.colors.avatar.label.active};
  `,
} as const;

const Root = styled.div<{ $state: AvatarState }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: ${({ theme }) => theme.spacing.height.small};
  height: ${({ theme }) => theme.spacing.height.small};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.avatar.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.extraSmall};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.extraSmall};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  text-transform: uppercase;
  cursor: pointer;
  ${({ $state }) => stateStyles[$state]}

  ${({ $state }) =>
    $state === 'enabled'
      ? css`
          &:hover {
            ${stateStyles.hover}
          }

          &:active {
            ${stateStyles.active}
          }
        `
      : null}
`;

const StatusMarkWrap = styled.span`
  position: absolute;
  right: calc(-1 * ${({ theme }) => theme.spacing.inner.xsClosest});
  bottom: ${({ theme }) => theme.spacing.inner.xsClosest};
  display: inline-flex;
`;

export const Avatar = ({
  initials = 'ЕВ',
  state = 'enabled',
  showStatusMark = true,
}: AvatarProps) => {
  return (
    <Root $state={state} aria-label={`Avatar ${initials}`} role="img">
      {initials}
      {showStatusMark ? (
        <StatusMarkWrap>
          <StatusMark appearance="success" size="Extra Small 12px" />
        </StatusMarkWrap>
      ) : null}
    </Root>
  );
};
