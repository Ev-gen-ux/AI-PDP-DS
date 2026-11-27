import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import { styled, css } from 'styled-components';
import { useTheme } from 'styled-components';
import {
  Connector,
  connectorLineKind,
  ContentColumn,
  FooterSlot,
  itemInvalidFlag,
  isCurrentStep,
  isStepDisabled,
  List,
  Nav,
  renderHeadingBlock,
  renderMarker,
  stepAriaInvalid,
  StepVerticalTrack,
  toMarkerVisual,
  Track,
  type StepperItem,
} from './stepperShared';

export type StepperGroupStep = Pick<
  StepperItem,
  'state' | 'invalid' | 'heading' | 'paragraph' | 'description' | 'markerIndex'
>;

export interface StepperGroupProps extends HTMLAttributes<HTMLElement> {
  orientation: 'horizontal' | 'vertical';
  steps: StepperGroupStep[];
  /**
   * Только `vertical`: после шага с этим индексом (0-based) показываются общие `children` и `footerContent`.
   * Мастер [stepperGroupVertical](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-32072) — `0` (после первого шага).
   */
  nestedContentStepIndex?: number;
  children?: ReactNode;
  footerContent?: ReactNode;
  'aria-label'?: string;
}

/** [stepperGroupHorizontal](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-31861): колонка `inner.grouped`, корень `inner.grouped` + `items-end`. */
const GroupHorizontalRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  width: 100%;
`;

const GroupStepsRowHorizontal = styled(List)`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.close};
`;

const GroupHorizontalStep = styled.li`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
`;

/**
 * Слот контента как в мастере (`tableCell.children` + высота из `spacing.stepper.groupContentMinHeight`).
 * `$endAlign`: вертикальный `stepperGroupVertical` — содержимое прижато к правому краю области слота.
 */
const GroupBodyChrome = styled.div<{ $endAlign?: boolean }>`
  box-sizing: border-box;
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.stepper.groupContentMinHeight};
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background-color: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
  ${({ $endAlign }) =>
    $endAlign
      ? css`
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
        `
      : undefined}
`;

const GroupVerticalRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.close};
  width: 100%;
`;

const GroupVerticalList = styled.ol`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.inner.close};
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const GroupVerticalStepBundle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  width: 100%;
`;

const GroupVerticalStepRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  width: 100%;
`;

/**
 * Вертикальная группа: отступ слева `spacing.paddings.xLarge` (40px, макет Figma),
 * слот и кнопки в колонке прижаты к правому краю.
 */
const GroupVerticalNestedActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.inner.grouped};
  box-sizing: border-box;
  width: 100%;
  padding-left: ${({ theme }) => theme.spacing.paddings.xLarge};
`;

function renderSharedSlots(
  children: ReactNode | undefined,
  footerContent: ReactNode | undefined,
  options?: { verticalNested?: boolean },
) {
  const endAlign = options?.verticalNested ?? false;
  return (
    <>
      {children != null ? <GroupBodyChrome $endAlign={endAlign}>{children}</GroupBodyChrome> : null}
      {footerContent != null ? <FooterSlot>{footerContent}</FooterSlot> : null}
    </>
  );
}

export const StepperGroup = ({
  orientation,
  steps,
  nestedContentStepIndex = 0,
  children,
  footerContent,
  'aria-label': ariaLabel = 'Steps',
  className,
  ...rest
}: StepperGroupProps) => {
  const theme = useTheme();
  const showSharedSlots = children != null || footerContent != null;
  const nestIdx = nestedContentStepIndex;

  if (orientation === 'horizontal') {
    return (
      <Nav aria-label={ariaLabel} className={className} {...rest}>
        <GroupHorizontalRoot>
          <GroupStepsRowHorizontal>
            {steps.map((step, index) => {
              const indexDisplay = step.markerIndex ?? index + 1;
              const showConnector = index < steps.length - 1;
              const lineKind = connectorLineKind(step.state);
              const isDisabled = isStepDisabled(step.state);
              const invalidFlag = itemInvalidFlag(step);
              const visual = toMarkerVisual(step.state, invalidFlag);
              const liProps = {
                'aria-current': isCurrentStep(step.state) ? ('step' as const) : undefined,
                'aria-invalid': stepAriaInvalid(step.state, invalidFlag),
              } satisfies LiHTMLAttributes<HTMLLIElement>;

              return (
                <GroupHorizontalStep key={index} {...liProps}>
                  <Track $orientation="horizontal">
                    {renderMarker(visual, indexDisplay, theme)}
                    {showConnector ? (
                      <Connector $orientation="horizontal" $line={lineKind} />
                    ) : null}
                  </Track>
                  <ContentColumn>{renderHeadingBlock(step, isDisabled)}</ContentColumn>
                </GroupHorizontalStep>
              );
            })}
          </GroupStepsRowHorizontal>
          {showSharedSlots ? renderSharedSlots(children, footerContent) : null}
        </GroupHorizontalRoot>
      </Nav>
    );
  }

  return (
    <Nav aria-label={ariaLabel} className={className} {...rest}>
      <GroupVerticalRoot>
        <GroupVerticalList>
          {steps.map((step, index) => {
            const indexDisplay = step.markerIndex ?? index + 1;
            const showConnector = index < steps.length - 1;
            const lineKind = connectorLineKind(step.state);
            const isDisabled = isStepDisabled(step.state);
            const invalidFlag = itemInvalidFlag(step);
            const visual = toMarkerVisual(step.state, invalidFlag);
            const liProps = {
              'aria-current': isCurrentStep(step.state) ? ('step' as const) : undefined,
              'aria-invalid': stepAriaInvalid(step.state, invalidFlag),
            } satisfies LiHTMLAttributes<HTMLLIElement>;

            const row = (
              <GroupVerticalStepRow>
                <StepVerticalTrack>
                  {renderMarker(visual, indexDisplay, theme)}
                  {showConnector ? <Connector $orientation="vertical" $line={lineKind} /> : null}
                </StepVerticalTrack>
                <ContentColumn>{renderHeadingBlock(step, isDisabled)}</ContentColumn>
              </GroupVerticalStepRow>
            );

            const attachNested = showSharedSlots && index === nestIdx;

            return (
              <li key={index} {...liProps}>
                {attachNested ? (
                  <GroupVerticalStepBundle>
                    {row}
                    <GroupVerticalNestedActions>
                      {renderSharedSlots(children, footerContent, { verticalNested: true })}
                    </GroupVerticalNestedActions>
                  </GroupVerticalStepBundle>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </GroupVerticalList>
      </GroupVerticalRoot>
    </Nav>
  );
};
