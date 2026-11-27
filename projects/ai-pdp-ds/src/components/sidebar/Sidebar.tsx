import { isValidElement, type ReactNode } from 'react';
import { styled, css } from 'styled-components';

export type SidebarState = 'default' | 'collapse';

export interface SidebarProps {
  state?: SidebarState;
  contentHeader?: boolean;
  contentBody?: boolean;
  contentFooter?: boolean;
  contentHeaderSlot?: ReactNode;
  contentBodySlot?: ReactNode;
  contentFooterSlot?: ReactNode;
}

type StyledProps = {
  $state: SidebarState;
};

const stateStyles = {
  default: css`
    width: 280px;
  `,
  collapse: css`
    width: 88px;
  `,
} as const;

const Root = styled.aside<StyledProps>`
  height: 640px;
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  background: ${({ theme }) => theme.colors.background.sideBar.calmest};
  border-right: 1px solid ${({ theme }) => theme.colors.border.subSection.calm};
  ${({ $state }) => stateStyles[$state]}
`;

const Header = styled.header`
  height: 64px;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.inner.related}
    ${({ theme }) => theme.spacing.paddings.default};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subSection.calm};
  display: flex;
  align-items: center;
`;

const Body = styled.main`
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.inner.grouped};
  background: ${({ theme }) => theme.colors.background.subSection.calm};
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer<StyledProps>`
  box-sizing: border-box;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.paddings.compactMedium};
  display: flex;
  justify-content: center;
  ${({ $state, theme }) =>
    $state === 'collapse'
      ? css`
          padding-left: ${theme.spacing.inner.grouped};
          padding-right: ${theme.spacing.inner.grouped};
        `
      : css`
          padding-left: 0;
          padding-right: 0;
        `}
`;

const HeaderContent = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.spacing.height.large};
  display: flex;
  align-items: center;
`;

const BodyContent = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex: 1;
  align-items: stretch;
`;

const FooterContent = styled.div<StyledProps>`
  height: 56px;
  display: flex;
  align-items: center;
  width: ${({ $state }) => ($state === 'default' ? '248px' : '100%')};
`;

const SlotPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px dashed ${({ theme }) => theme.colors.tableCell.children.border.calm};
  background: ${({ theme }) => theme.colors.tableCell.children.background.enabled};
`;

const resolveSlot = (slot: ReactNode | undefined, fallback: ReactNode): ReactNode | null => {
  if (slot === undefined) return fallback;
  if (slot === null || slot === false) return null;
  if (typeof slot === 'string' || typeof slot === 'number' || isValidElement(slot)) return slot;
  return fallback;
};

export const Sidebar = ({
  state = 'default',
  contentHeader = true,
  contentBody = true,
  contentFooter = true,
  contentHeaderSlot,
  contentBodySlot,
  contentFooterSlot,
}: SidebarProps) => {
  const headerSlot = resolveSlot(contentHeaderSlot, <SlotPlaceholder aria-hidden="true" />);
  const bodySlot = resolveSlot(contentBodySlot, <SlotPlaceholder aria-hidden="true" />);
  const footerSlot = resolveSlot(contentFooterSlot, <SlotPlaceholder aria-hidden="true" />);

  return (
    <Root $state={state}>
      <Header>
        <HeaderContent>{contentHeader ? headerSlot : null}</HeaderContent>
      </Header>

      <Body>
        <BodyContent>{contentBody ? bodySlot : null}</BodyContent>
      </Body>

      <Footer $state={state}>
        <FooterContent $state={state}>{contentFooter ? footerSlot : null}</FooterContent>
      </Footer>
    </Root>
  );
};
