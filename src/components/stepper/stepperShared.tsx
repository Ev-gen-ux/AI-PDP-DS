import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import { Icon, stepperMarkerCompleteIconGlyph } from '@/components/icon';

/** Состояние шага (мастер Figma `state`). */
export type StepperItemState = 'completed' | 'active' | 'disabled' | 'invalid';

/** Визуальное состояние маркера (включая комбинацию active + invalid). */
export type StepperMarkerVisual = 'completed' | 'active' | 'invalid' | 'disabled';

export interface StepperItem {
  /** `completed` | `active` | `disabled` | `invalid` — как в мастере Figma. */
  state: StepperItemState;
  /**
   * Флаг ошибки (`true` | `false`), мастер Figma `inValid`.
   * Вместе с `state === 'active'` даёт маркер ошибки; при `state === 'invalid'` маркер ошибки без флага.
   */
  invalid?: boolean;
  /** Заголовок (`heading`): типографика component/base/semibold. */
  heading: string;
  /**
   * Показывать абзац описания (мастер `<paragraph>`). По умолчанию `true`; при `false` `description` не рендерится.
   */
  paragraph?: boolean;
  /** Описание (`<p>`): типографика component/small/regular. */
  description?: string;
  /**
   * Показывать слот тела (`body` / `children`). По умолчанию `true` (как в макете).
   */
  body?: boolean;
  /** Содержимое слота body. */
  children?: ReactNode;
  /**
   * Показывать подвал с действиями (`<footer> actions`). По умолчанию `true` (как в макете).
   */
  footer?: boolean;
  /** Содержимое подвала (мастер Figma: `Button` flat «Prev» + outline «Next», обычно `size="medium"`). */
  footerContent?: ReactNode;
  /** Номер в маркере для незавершённых шагов; по умолчанию индекс + 1 */
  markerIndex?: number;
}

export function itemInvalidFlag(item: Pick<StepperItem, 'invalid'>): boolean {
  return item.invalid === true;
}

export function toMarkerVisual(state: StepperItemState, invalidFlag: boolean): StepperMarkerVisual {
  if (state === 'completed') return 'completed';
  if (state === 'disabled') return 'disabled';
  if (state === 'invalid' || invalidFlag) return 'invalid';
  return 'active';
}

export function connectorLineKind(state: StepperItemState): 'enabled' | 'active' | 'disabled' {
  if (state === 'completed') return 'enabled';
  if (state === 'disabled') return 'disabled';
  return 'active';
}

export function isStepDisabled(state: StepperItemState): boolean {
  return state === 'disabled';
}

export function isCurrentStep(state: StepperItemState): boolean {
  return state === 'active' || state === 'invalid';
}

export function stepAriaInvalid(
  state: StepperItemState,
  invalidFlag: boolean,
): boolean | undefined {
  if (state === 'invalid') return true;
  if (state === 'active' && invalidFlag) return true;
  return undefined;
}

type MarkerProps = { $visual: StepperMarkerVisual };

const markerSurfaceStyles = {
  completed: css`
    background-color: ${({ theme }) => theme.colors.stepper.backgroundMark.enabled};
    border: 1px solid transparent;
  `,
  active: css`
    background-color: ${({ theme }) => theme.colors.stepper.backgroundMark.active};
    border: 1px solid ${({ theme }) => theme.colors.stepper.border.loud.enabled};
  `,
  invalid: css`
    background-color: ${({ theme }) => theme.colors.stepper.backgroundMark.active};
    border: 1px solid ${({ theme }) => theme.colors.stepper.border.loud.error};
  `,
  disabled: css`
    background-color: ${({ theme }) => theme.colors.stepper.backgroundMark.disabled};
    border: 1px solid transparent;
  `,
} as const;

export const MarkerShell = styled.div<MarkerProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing.stepper.markerSize};
  height: ${({ theme }) => theme.spacing.stepper.markerSize};
  border-radius: ${({ theme }) => theme.borderRadius.sectionInner};
  flex-shrink: 0;
  ${({ $visual }) => markerSurfaceStyles[$visual]}
`;

const markerNumberTypography = {
  active: css`
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.stepper.label.enabled};
  `,
  invalid: css`
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.stepper.label.error};
  `,
  disabled: css`
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.stepper.label.disabled};
  `,
} as const;

export const MarkerNumber = styled.span<{ $variant: keyof typeof markerNumberTypography }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  text-align: center;
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
  ${({ $variant }) => markerNumberTypography[$variant]}
`;

type ConnectorProps = {
  $orientation: 'horizontal' | 'vertical';
  $line: 'enabled' | 'active' | 'disabled';
};

export const Connector = styled.div<ConnectorProps>`
  flex-shrink: 0;
  background-color: ${({ theme, $line }) => theme.colors.stepper.progressLine[$line]};
  ${({ theme, $orientation }) =>
    $orientation === 'horizontal'
      ? css`
          flex: 1 1 0;
          min-width: ${theme.spacing.stepper.markerSize};
          height: ${theme.spacing.stepper.lineThickness};
          align-self: center;
        `
      : css`
          width: ${theme.spacing.stepper.lineThickness};
          height: ${theme.spacing.stepper.connectorVertical};
        `}
`;

export const Track = styled.div<{ $orientation: 'horizontal' | 'vertical' }>`
  display: flex;
  ${({ $orientation }) =>
    $orientation === 'horizontal'
      ? css`
          flex-direction: row;
          align-items: center;
          gap: ${({ theme }) => theme.spacing.inner.closest};
          width: 100%;
        `
      : css`
          flex-direction: column;
          align-items: center;
          gap: ${({ theme }) => theme.spacing.inner.closest};
        `}
`;

export const HeadingText = styled.div<{ $disabled: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.stepper.label.disabled : theme.colors.stepper.label.enabled};
`;

export const DescriptionText = styled.div<{ $disabled: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.colors.stepper.description.disabled
      : theme.colors.stepper.description.enabled};
`;

/** Мастер Figma: `<hgroup/>` — заголовок и описание. */
export const HeadingGroup = styled.hgroup`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.close};
  width: 100%;
  margin: 0;
`;

export const BodySlot = styled.div`
  width: 100%;
`;

export const FooterSlot = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.inner.related};
  width: 100%;
`;

export const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  flex: 1 1 0;
  min-width: 0;
`;

export const StepHorizontal = styled.li`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
`;

export const StepVerticalRoot = styled.li`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  width: 100%;
`;

/** Мастер Figma: контейнер маркера и линии (`step-status-vertical` / горизонтальный трек). */
export const StepVerticalTrack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.closest};
  flex-shrink: 0;
`;

export const List = styled.ol`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const ListHorizontal = styled(List)`
  flex-direction: row;
  align-items: stretch;
`;

export const ListVertical = styled(List)`
  flex-direction: column;
  align-items: stretch;
  gap: 0;
`;

export const Nav = styled.nav`
  width: 100%;
`;

export function renderMarker(
  visual: StepperMarkerVisual,
  indexDisplay: number,
  theme: DefaultTheme,
) {
  if (visual === 'completed') {
    return (
      <MarkerShell $visual="completed" aria-hidden>
        <Icon
          icon={stepperMarkerCompleteIconGlyph}
          size={16}
          color={theme.colors.stepper.icon.calm.enabled}
          weight="bold"
        />
      </MarkerShell>
    );
  }
  if (visual === 'active') {
    return (
      <MarkerShell $visual="active" aria-hidden>
        <MarkerNumber $variant="active">{indexDisplay}</MarkerNumber>
      </MarkerShell>
    );
  }
  if (visual === 'invalid') {
    return (
      <MarkerShell $visual="invalid" aria-hidden>
        <MarkerNumber $variant="invalid">{indexDisplay}</MarkerNumber>
      </MarkerShell>
    );
  }
  return (
    <MarkerShell $visual="disabled" aria-hidden>
      <MarkerNumber $variant="disabled">{indexDisplay}</MarkerNumber>
    </MarkerShell>
  );
}

export function renderHeadingBlock(
  item: Pick<StepperItem, 'heading' | 'paragraph' | 'description'>,
  isDisabled: boolean,
) {
  const showParagraph = item.paragraph !== false;
  const showDescription = showParagraph && Boolean(item.description);

  return (
    <HeadingGroup>
      <HeadingText $disabled={isDisabled}>{item.heading}</HeadingText>
      {showDescription ? (
        <DescriptionText $disabled={isDisabled}>{item.description}</DescriptionText>
      ) : null}
    </HeadingGroup>
  );
}

export function renderStepContent(item: StepperItem, isDisabled: boolean) {
  const showBody = item.body !== false;
  const showFooter = item.footer !== false;

  return (
    <ContentColumn>
      {renderHeadingBlock(item, isDisabled)}
      {showBody ? <BodySlot>{item.children ?? null}</BodySlot> : null}
      {showFooter ? <FooterSlot>{item.footerContent ?? null}</FooterSlot> : null}
    </ContentColumn>
  );
}
