import type { HTMLAttributes, LiHTMLAttributes } from 'react';
import { useTheme } from 'styled-components';
import {
  Connector,
  connectorLineKind,
  itemInvalidFlag,
  isCurrentStep,
  isStepDisabled,
  ListHorizontal,
  ListVertical,
  Nav,
  renderMarker,
  renderStepContent,
  stepAriaInvalid,
  StepHorizontal,
  StepVerticalRoot,
  StepVerticalTrack,
  toMarkerVisual,
  Track,
  type StepperItem,
} from './stepperShared';

export type { StepperItem, StepperItemState } from './stepperShared';

export interface StepperProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  items: StepperItem[];
  'aria-label'?: string;
}

export const Stepper = ({
  orientation = 'horizontal',
  items,
  'aria-label': ariaLabel = 'Steps',
  className,
  ...rest
}: StepperProps) => {
  const theme = useTheme();
  const listProps = {
    ...rest,
    className,
  } satisfies HTMLAttributes<HTMLOListElement>;

  if (orientation === 'vertical') {
    return (
      <Nav aria-label={ariaLabel}>
        <ListVertical {...listProps}>
          {items.map((item, index) => {
            const indexDisplay = item.markerIndex ?? index + 1;
            const showConnector = index < items.length - 1;
            const lineKind = connectorLineKind(item.state);
            const isDisabled = isStepDisabled(item.state);
            const invalidFlag = itemInvalidFlag(item);
            const visual = toMarkerVisual(item.state, invalidFlag);
            const liProps = {
              'aria-current': isCurrentStep(item.state) ? ('step' as const) : undefined,
              'aria-invalid': stepAriaInvalid(item.state, invalidFlag),
            } satisfies LiHTMLAttributes<HTMLLIElement>;

            return (
              <StepVerticalRoot key={index} {...liProps}>
                <StepVerticalTrack>
                  {renderMarker(visual, indexDisplay, theme)}
                  {showConnector ? <Connector $orientation="vertical" $line={lineKind} /> : null}
                </StepVerticalTrack>
                {renderStepContent(item, isDisabled)}
              </StepVerticalRoot>
            );
          })}
        </ListVertical>
      </Nav>
    );
  }

  return (
    <Nav aria-label={ariaLabel}>
      <ListHorizontal {...listProps}>
        {items.map((item, index) => {
          const indexDisplay = item.markerIndex ?? index + 1;
          const showConnector = index < items.length - 1;
          const lineKind = connectorLineKind(item.state);
          const isDisabled = isStepDisabled(item.state);
          const invalidFlag = itemInvalidFlag(item);
          const visual = toMarkerVisual(item.state, invalidFlag);

          const liProps = {
            'aria-current': isCurrentStep(item.state) ? ('step' as const) : undefined,
            'aria-invalid': stepAriaInvalid(item.state, invalidFlag),
          } satisfies LiHTMLAttributes<HTMLLIElement>;

          return (
            <StepHorizontal key={index} {...liProps}>
              <Track $orientation="horizontal">
                {renderMarker(visual, indexDisplay, theme)}
                {showConnector ? <Connector $orientation="horizontal" $line={lineKind} /> : null}
              </Track>
              {renderStepContent(item, isDisabled)}
            </StepHorizontal>
          );
        })}
      </ListHorizontal>
    </Nav>
  );
};
