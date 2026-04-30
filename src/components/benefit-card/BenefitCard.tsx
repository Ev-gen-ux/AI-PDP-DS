import { isValidElement, type ReactNode, useId } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@/components/button';
import { Icon, metaIconGlyph } from '@/components/icon';
import { StatusLabel } from '@/components/status-label';

export type BenefitCardAppearance = 'primary' | 'secondary';

export interface BenefitCardProps {
  appearance?: BenefitCardAppearance;
  heading?: string;
  description?: string;
  statusLabelText?: string;
  contentBefore?: boolean;
  contentAfter?: boolean;
  hasIcon?: boolean;
  hasLabel?: boolean;
  hasButtonPrimary?: boolean;
  hasButtonOutline?: boolean;
  childrenBody?: boolean;
  contentBeforeSlot?: ReactNode;
  contentAfterSlot?: ReactNode;
  childrenBodySlot?: ReactNode;
  icon?: ReactNode | boolean;
  children?: ReactNode;
  primaryButtonText?: string;
  outlineButtonText?: string;
  onPrimaryClick?: () => void;
  onOutlineClick?: () => void;
}

type StyledProps = {
  $appearance: BenefitCardAppearance;
};

const appearanceStyles = {
  primary: css`
    padding: ${({ theme }) => theme.spacing.paddings.relaxed};
    border-radius: ${({ theme }) => theme.borderRadius.sectionInner};
    background: ${({ theme }) => theme.colors.background.benefitCard.calm};
    border: 1px solid ${({ theme }) => theme.colors.border.subSection.calm};
    box-shadow: ${({ theme }) => theme.effects.surface.elevated};
  `,
  secondary: css`
    padding: ${({ theme }) => theme.spacing.inner.noGap};
    border-radius: ${({ theme }) => theme.borderRadius.containerBase};
    background: transparent;
    border: 0;
    box-shadow: none;
  `,
} as const;

const Root = styled.article<StyledProps>`
  width: 352px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.relaxed};
  ${({ $appearance }) => appearanceStyles[$appearance]}
`;

const TopRow = styled.div`
  min-height: ${({ theme }) => theme.spacing.height.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.inner.related};
`;

const TopSide = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
`;

const Heading = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.heading.h5};
  line-height: ${({ theme }) => theme.typography.lineHeight.heading.h5};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
`;

const ChildrenSlot = styled.div`
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.height.small};
  box-sizing: border-box;
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
`;

const ActionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.inner.related};
`;

const SlotBox = styled.div`
  width: ${({ theme }) => theme.spacing.height.small};
  height: ${({ theme }) => theme.spacing.height.small};
  box-sizing: border-box;
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
`;

const IconWrap = styled.span`
  width: ${({ theme }) => theme.spacing.height.small};
  height: ${({ theme }) => theme.spacing.height.small};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.icon.secondary.calm};
`;

const resolveNode = (
  node: ReactNode | boolean | undefined,
  fallback: ReactNode,
): ReactNode | null => {
  if (node === undefined) return fallback;
  if (node === null || node === false) return null;
  if (node === true) return fallback;
  if (typeof node === 'string' || typeof node === 'number' || isValidElement(node)) return node;
  return fallback;
};

export const BenefitCard = ({
  appearance = 'primary',
  heading = 'Benefit Heading',
  description = 'Description',
  statusLabelText = 'Status Label',
  contentBefore = true,
  contentAfter = true,
  hasIcon = true,
  hasLabel = true,
  hasButtonPrimary = true,
  hasButtonOutline = true,
  childrenBody = true,
  contentBeforeSlot,
  contentAfterSlot,
  childrenBodySlot,
  icon = true,
  children,
  primaryButtonText = 'Button Label',
  outlineButtonText = 'Button Label',
  onPrimaryClick,
  onOutlineClick,
}: BenefitCardProps) => {
  const headingId = useId();
  const resolvedIcon = resolveNode(
    icon,
    <Icon icon={metaIconGlyph} size={24} color="currentColor" aria-hidden="true" />,
  );
  const beforeSlot = resolveNode(contentBeforeSlot, <SlotBox aria-hidden="true" />);
  const afterSlot = resolveNode(contentAfterSlot, <SlotBox aria-hidden="true" />);

  return (
    <Root $appearance={appearance} aria-labelledby={headingId}>
      <TopRow>
        <TopSide>
          {contentBefore ? beforeSlot : null}
          {hasIcon && resolvedIcon ? <IconWrap>{resolvedIcon}</IconWrap> : null}
        </TopSide>
        <TopSide>
          {hasLabel ? (
            <StatusLabel
              text={statusLabelText}
              appearance="secondary"
              status="wait"
              size="medium"
            />
          ) : null}
          {contentAfter ? afterSlot : null}
        </TopSide>
      </TopRow>

      <TextContainer>
        <Heading id={headingId}>{heading}</Heading>
        <Description>{description}</Description>
      </TextContainer>

      {childrenBody ? (childrenBodySlot ?? children ?? <ChildrenSlot aria-hidden="true" />) : null}

      <ActionsContainer>
        {hasButtonPrimary ? (
          <Button
            appearance="primary"
            size="large"
            text={primaryButtonText}
            {...(onPrimaryClick ? { onClick: onPrimaryClick } : {})}
          />
        ) : null}
        {hasButtonOutline ? (
          <Button
            appearance="outline"
            size="large"
            text={outlineButtonText}
            {...(onOutlineClick ? { onClick: onOutlineClick } : {})}
          />
        ) : null}
      </ActionsContainer>
    </Root>
  );
};
