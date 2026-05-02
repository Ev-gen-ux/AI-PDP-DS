import type { ComponentType } from 'react';
import {
  CalendarBlankIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  DotsThreeIcon,
  InfoIcon,
  LinkIcon,
  MetaLogoIcon,
  SunIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import styled from 'styled-components';

export type IconSize = 16 | 24;

type GlyphComponent = ComponentType<PhosphorIconProps>;

export const fallbackIconGlyph: GlyphComponent = CodeIcon;
export const metaIconGlyph: GlyphComponent = MetaLogoIcon;
export const linkIconGlyph: GlyphComponent = LinkIcon;
export const sunIconGlyph: GlyphComponent = SunIcon;
export const statusSuccessIconGlyph: GlyphComponent = CheckCircleIcon;
export const statusInformationIconGlyph: GlyphComponent = InfoIcon;
export const statusAlertIconGlyph: GlyphComponent = WarningIcon;
export const warningCircleIconGlyph: GlyphComponent = WarningCircleIcon;
export const statusWaitIconGlyph: GlyphComponent = ClockIcon;
export const statusErrorIconGlyph: GlyphComponent = XCircleIcon;
export const xIconGlyph: GlyphComponent = XIcon;
export const caretDownIconGlyph: GlyphComponent = CaretDownIcon;
export const caretUpIconGlyph: GlyphComponent = CaretUpIcon;
export const dotsThreeIconGlyph: GlyphComponent = DotsThreeIcon;
export const calendarBlankIconGlyph: GlyphComponent = CalendarBlankIcon;

export interface IconProps extends Omit<PhosphorIconProps, 'size'> {
  icon: GlyphComponent;
  size?: IconSize;
}

const Root = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: inherit;
`;

export const Icon = ({
  icon: Glyph,
  size = 24,
  color = 'currentColor',
  weight = 'bold',
  ...rest
}: IconProps) => {
  return (
    <Root>
      <Glyph size={size} weight={weight} color={color} {...rest} />
    </Root>
  );
};
