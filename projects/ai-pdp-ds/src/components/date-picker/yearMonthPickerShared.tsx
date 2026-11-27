import { styled, css } from 'styled-components';
import {
  Icon,
  datePickerMonthSelectIconGlyph,
  datePickerNextMonthIconGlyph,
  datePickerPrevMonthIconGlyph,
} from '@/components/icon';

export const PickerPanel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compactMedium};
  width: fit-content;
  padding: ${({ theme }) => theme.spacing.paddings.default}
    ${({ theme }) => theme.spacing.paddings.relaxed};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  background-color: ${({ theme }) => theme.colors.datePicker.background.calm.enabled};
  box-shadow: ${({ theme }) => theme.effects.surface.elevated};
`;

/** Шапка + линия: один столбец с единым отступом `paddings.compactMedium` до разделителя. */
export const PickerHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compactMedium};
  width: 100%;
`;

export const PickerHeader = styled.div`
  display: flex;
  align-items: center;
  width: calc(${({ theme }) => theme.spacing.height.small} * 7);
  gap: ${({ theme }) => theme.spacing.inner.related};
`;

const rangeGroupBase = css`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.inner.related};
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.datePicker.caret.calm.enabled};
  text-align: left;
`;

export const PickerRangeGroup = styled.button`
  ${rangeGroupBase}
  cursor: pointer;

  &:focus-visible {
    outline: none;
    border-radius: ${({ theme }) => theme.borderRadius.componentBase};
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    cursor: default;
    color: ${({ theme }) => theme.colors.datePicker.caret.calm.disabled};
  }
`;

export const PickerRangeStatic = styled.div`
  ${rangeGroupBase}
  cursor: default;
`;

export const PickerRangeText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.datePicker.label.calm.enabled};
  white-space: nowrap;
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
`;

export const PickerNavGroup = styled.div`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
  gap: ${({ theme }) => theme.spacing.inner.noGap};
`;

export const PickerNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: ${({ theme }) => theme.spacing.height.base};
  min-height: ${({ theme }) => theme.spacing.height.base};
  margin: 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  background: transparent;
  color: ${({ theme }) => theme.colors.datePicker.caret.calm.enabled};
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.datePicker.caret.calm.disabled};
    cursor: not-allowed;
  }
`;

export const PickerHeaderDivider = styled.div`
  box-sizing: border-box;
  width: calc(${({ theme }) => theme.spacing.height.small} * 7);
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.datePicker.border.calm.enabled};
`;

export const PickerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.close};
  align-items: flex-start;
`;

export const PickerLeadRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

/** Ширина первой колонки по макету: 40 + 1 (≈41px). */
export const PickerLeadCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: calc(
    ${({ theme }) => theme.spacing.height.base} + ${({ theme }) => theme.spacing.inner.xsClosest}
  );
  padding: ${({ theme }) => theme.spacing.inner.closest}
    ${({ theme }) => theme.spacing.inner.closest};
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.enabled};
`;

export const PickerLeadLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.datePicker.label.calm.secondary};
  text-align: center;
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
`;

export const PickerGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.inner.close};
  width: calc(${({ theme }) => theme.spacing.height.small} * 7);
`;

export const PickerGridRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.inner.closest};
  align-items: flex-start;
  width: 100%;
`;

export const PickerGridCell = styled.div`
  display: flex;
  flex: 1 1 0;
  align-items: stretch;
  justify-content: stretch;
  min-width: 0;
`;

type ChoiceButtonStyledProps = { $selected: boolean };

const choiceStyles = {
  base: css`
    box-sizing: border-box;
    display: inline-flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    min-width: 0;
    margin: 0;
    padding: ${({ theme }) => theme.spacing.inner.close}
      ${({ theme }) => theme.spacing.inner.closest};
    border-width: 1px;
    border-style: solid;
    border-radius: ${({ theme }) => theme.borderRadius.componentInner};
    background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.enabled};
    font-family: ${({ theme }) => theme.typography.fontFamily.component};
    font-size: ${({ theme }) => theme.typography.fontSize.component.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    text-align: center;
    cursor: pointer;
    font-feature-settings:
      'lnum' 1,
      'tnum' 1;

    &:focus-visible {
      outline: none;
      box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
    }

    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.hover};
    }
  `,
  default: css`
    color: ${({ theme }) => theme.colors.datePicker.label.calm.enabled};
    border-color: transparent;
  `,
  selected: css`
    color: ${({ theme }) => theme.colors.datePicker.label.calm.active};
    border-color: ${({ theme }) => theme.colors.datePicker.border.calm.active};
    background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.enabled};

    &:hover:enabled {
      background-color: ${({ theme }) => theme.colors.datePicker.buttonDay.background.hover};
    }
  `,
} as const;

export const PickerChoiceButton = styled.button<ChoiceButtonStyledProps>`
  ${choiceStyles.base}
  ${({ $selected }) => ($selected ? choiceStyles.selected : choiceStyles.default)}
`;

export interface PickerChromeHeaderProps {
  rangeLabel: string;
  onRangeClick?: (() => void) | undefined;
  rangeDisabled?: boolean | undefined;
  onPrev?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  prevDisabled?: boolean | undefined;
  nextDisabled?: boolean | undefined;
  prevAriaLabel: string;
  nextAriaLabel: string;
  rangeAriaLabel?: string | undefined;
}

export function PickerChromeHeader({
  rangeLabel,
  onRangeClick,
  rangeDisabled,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  prevAriaLabel,
  nextAriaLabel,
  rangeAriaLabel,
}: PickerChromeHeaderProps) {
  const rangeContent = (
    <>
      <PickerRangeText>{rangeLabel}</PickerRangeText>
      <Icon
        icon={datePickerMonthSelectIconGlyph}
        size={16}
        weight="bold"
        color="currentColor"
        aria-hidden
      />
    </>
  );

  return (
    <PickerHeaderSection>
      <PickerHeader>
        {onRangeClick ? (
          <PickerRangeGroup
            type="button"
            onClick={onRangeClick}
            disabled={rangeDisabled}
            aria-label={rangeAriaLabel ?? rangeLabel}
          >
            {rangeContent}
          </PickerRangeGroup>
        ) : (
          <PickerRangeStatic>{rangeContent}</PickerRangeStatic>
        )}
        <PickerNavGroup>
          <PickerNavButton
            type="button"
            aria-label={prevAriaLabel}
            disabled={prevDisabled ?? !onPrev}
            onClick={onPrev}
          >
            <Icon
              icon={datePickerPrevMonthIconGlyph}
              size={16}
              weight="bold"
              color="currentColor"
              aria-hidden
            />
          </PickerNavButton>
          <PickerNavButton
            type="button"
            aria-label={nextAriaLabel}
            disabled={nextDisabled ?? !onNext}
            onClick={onNext}
          >
            <Icon
              icon={datePickerNextMonthIconGlyph}
              size={16}
              weight="bold"
              color="currentColor"
              aria-hidden
            />
          </PickerNavButton>
        </PickerNavGroup>
      </PickerHeader>
      <PickerHeaderDivider />
    </PickerHeaderSection>
  );
}
