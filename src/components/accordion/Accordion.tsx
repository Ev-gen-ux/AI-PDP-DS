import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { styled, css } from 'styled-components';
import { ButtonIcon } from '@/components/button-icon';

export type AccordionAppearance = 'default' | 'calm' | 'accent';

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string;
  open?: boolean;
  defaultOpen?: boolean;
  childrenBody?: ReactNode;
  onOpenChange?: (nextOpen: boolean) => void;
  /** Визуальный вариант оболочки (Figma: default / calm header / accent border). */
  appearance?: AccordionAppearance;
}

type RootProps = {
  $open: boolean;
  $appearance: AccordionAppearance;
};

type HeaderProps = {
  $open: boolean;
};

type ToggleProps = {
  $open: boolean;
};

const appearanceShellStyles = {
  default: css`
    border: 1px solid ${({ theme }) => theme.colors.accordion.border.enabled};
    background-color: ${({ theme }) => theme.colors.accordion.background.enabled};
  `,
  calm: css`
    border: 1px solid ${({ theme }) => theme.colors.accordion.border.enabled};
    background-color: ${({ theme }) => theme.colors.accordion.background.calm};
  `,
  accent: css`
    border: 2px solid ${({ theme }) => theme.colors.accordion.border.accent};
    background-color: ${({ theme }) => theme.colors.accordion.background.enabled};
  `,
} as const;

const Root = styled.section<RootProps>`
  width: 100%;
  max-width: 920px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  overflow: hidden;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${({ $appearance }) => appearanceShellStyles[$appearance]}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme, $appearance }) =>
        $appearance === 'calm'
          ? theme.colors.accordion.background.calmHover
          : theme.colors.accordion.background.hover};
    }
  }

  &:focus-within {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  ${({ $open }) =>
    $open
      ? css`
          min-height: 190px;
        `
      : css`
          min-height: 68px;
        `}
`;

const Header = styled.div<HeaderProps>`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.paddings.medium};
  padding: ${({ theme }) =>
    `${theme.spacing.paddings.medium} ${theme.spacing.paddings.medium} ${theme.spacing.paddings.default} ${theme.spacing.paddings.relaxed}`};

  ${({ $open }) =>
    $open &&
    css`
      border-bottom: 1px solid ${({ theme }) => theme.colors.accordion.border.enabled};
    `}
`;

const Title = styled.h3`
  margin: 0;
  min-width: 0;
  flex: 1 0 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.typography.fontSize.heading.h5};
  line-height: ${({ theme }) => theme.typography.lineHeight.heading.h5};
  color: ${({ theme }) => theme.colors.text.base};
  font-feature-settings:
    'lnum' 1,
    'tnum' 1;
`;

const Toggle = styled(ButtonIcon)<ToggleProps>`
  ${({ $open }) =>
    $open &&
    css`
      &:enabled {
        background-color: ${({ theme }) => theme.colors.button.icon.primary.background.active};
      }
    `}
`;

const Body = styled.div`
  width: 100%;
  min-height: 122px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.paddings.medium} ${theme.spacing.paddings.relaxed}`};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.containerBase}
    ${({ theme }) => theme.borderRadius.containerBase};
`;

const BodySlot = styled.div`
  width: 100%;
  height: 82px;
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background-color: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
`;

export const Accordion = ({
  title = 'Heading',
  open,
  defaultOpen = false,
  childrenBody,
  onOpenChange,
  appearance = 'default',
  id,
  ...rest
}: AccordionProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  const autoId = useId();
  const panelId = id ? `${id}-panel` : `${autoId}-panel`;
  const headingId = id ? `${id}-heading` : `${autoId}-heading`;

  const handleToggle = () => {
    const nextOpen = !isOpen;

    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  return (
    <Root
      $open={isOpen}
      $appearance={appearance}
      id={id}
      role="region"
      aria-labelledby={headingId}
      {...rest}
    >
      <Header $open={isOpen}>
        <Title id={headingId}>{title}</Title>
        <Toggle
          appearance="primary"
          size="small"
          icon={isOpen ? 'caret-up' : 'caret-down'}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
          $open={isOpen}
          onClick={handleToggle}
        />
      </Header>
      {isOpen ? <Body id={panelId}>{childrenBody ?? <BodySlot />}</Body> : null}
    </Root>
  );
};
