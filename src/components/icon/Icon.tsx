import type { ComponentType } from 'react';
import {
  CalendarBlankIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  DotsThreeIcon,
  EnvelopeSimpleIcon,
  FileIcon,
  InfoIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  MetaLogoIcon,
  SunIcon,
  TrashIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import styled from 'styled-components';
import { FileXlsIcon } from './FileXlsIcon';

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
export const caretLeftIconGlyph: GlyphComponent = CaretLeftIcon;
export const caretRightIconGlyph: GlyphComponent = CaretRightIcon;
export const caretUpIconGlyph: GlyphComponent = CaretUpIcon;
export const dotsThreeIconGlyph: GlyphComponent = DotsThreeIcon;
export const calendarBlankIconGlyph: GlyphComponent = CalendarBlankIcon;
export const caretDoubleLeftIconGlyph: GlyphComponent = CaretDoubleLeftIcon;
export const caretDoubleRightIconGlyph: GlyphComponent = CaretDoubleRightIcon;

/** DatePicker: раскрытие месяца/года (Figma caret-down) */
export const datePickerMonthSelectIconGlyph: GlyphComponent = CaretDownIcon;
/** DatePicker: предыдущий месяц */
export const datePickerPrevMonthIconGlyph: GlyphComponent = CaretLeftIcon;
/** DatePicker: следующий месяц */
export const datePickerNextMonthIconGlyph: GlyphComponent = CaretRightIcon;

/** InputFile: иконка загрузки (Figma upload-simple) */
export const uploadSimpleIconGlyph: GlyphComponent = UploadSimpleIcon;
/** Общий файл (Phosphor); для дефолта FileUpload см. {@link fileXlsIconGlyph} */
export const fileGlyphIconGlyph: GlyphComponent = FileIcon;
/** FileUpload: иконка файла из Figma FileXls (node 3392:28752) */
export const fileXlsIconGlyph: GlyphComponent = FileXlsIcon;
/** FileUpload: удалить файл */
export const trashSimpleIconGlyph: GlyphComponent = TrashIcon;
/** InputSearch: лупа слева (Figma magnifying-glass) */
export const inputSearchLeadingIconGlyph: GlyphComponent = MagnifyingGlassIcon;
/** InputEmail: конверт слева (Figma envelope-simple) */
export const inputEmailLeadingIconGlyph: GlyphComponent = EnvelopeSimpleIcon;

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
