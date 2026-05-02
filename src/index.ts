// AI-PDP-DS — public API entry point
// Импортируйте компоненты из корня пакета: import { Button } from '@ev-gen-ux/ai-pdp-ds';

// Theme
export { theme } from './theme/tokens';
export type { Theme } from './theme/tokens';

// Components — atoms
export { Button } from './components/button';
export type { ButtonProps } from './components/button';
export { ButtonIcon } from './components/button-icon';
export type {
  ButtonIconAppearance,
  ButtonIconGlyph,
  ButtonIconProps,
  ButtonIconSize,
} from './components/button-icon';
export { Accordion } from './components/accordion';
export type { AccordionAppearance, AccordionProps } from './components/accordion';
export { ButtonLink } from './components/button-link';
export type {
  ButtonLinkAppearance,
  ButtonLinkProps,
  ButtonLinkState,
} from './components/button-link';
export { Breadcrumbs } from './components/breadcrumbs';
export type {
  BreadcrumbsItemNode,
  BreadcrumbsItemState,
  BreadcrumbsMoreNode,
  BreadcrumbsMoreState,
  BreadcrumbsNode,
  BreadcrumbsProps,
} from './components/breadcrumbs';
export { Chips } from './components/chips';
export type { ChipsProps, ChipsSize, ChipsState } from './components/chips';
export { Counter, counterLayoutBucket, formatCounterValue } from './components/counter';
export type {
  CounterAppearance,
  CounterBucket,
  CounterProps,
  CounterSize,
} from './components/counter';
export { ToggleButton } from './components/toggle-button';
export type {
  ToggleButtonAppearance,
  ToggleButtonProps,
  ToggleButtonState,
} from './components/toggle-button';
export { InputDate } from './components/input-date';
export type { InputDateProps } from './components/input-date';
export { InputText } from './components/input-text';
export type { InputTextProps } from './components/input-text';
export { Checkbox } from './components/checkbox';
export type { CheckboxProps, CheckboxState } from './components/checkbox';
export { BenefitCard } from './components/benefit-card';
export type { BenefitCardAppearance, BenefitCardProps } from './components/benefit-card';
export { DropdownItem } from './components/dropdown-item';
export type { DropdownItemProps, DropdownItemState } from './components/dropdown-item';
export { DropdownList } from './components/dropdown-list';
export type { DropdownListOption, DropdownListProps } from './components/dropdown-list';
export { SelectButton } from './components/select-button';
export type {
  SelectButtonOption,
  SelectButtonProps,
  SelectButtonSize,
  SelectButtonState,
} from './components/select-button';
export { Radio } from './components/radio';
export type { RadioProps, RadioState } from './components/radio';
export { InlineMessage } from './components/inline-message';
export type { InlineMessageProps, InlineMessageStatus } from './components/inline-message';
export { Icon } from './components/icon';
export type { IconProps, IconSize } from './components/icon';
export { NotificationSnackbar } from './components/notification-snackbar';
export type {
  NotificationSnackbarAppearance,
  NotificationSnackbarProps,
} from './components/notification-snackbar';
export { Pagination, buildPaginationItems } from './components/pagination';
export type { PaginationItem, PaginationProps } from './components/pagination';
export { Spinner } from './components/spinner';
export type { SpinnerProps, SpinnerSize } from './components/spinner';
export { SplitButton } from './components/split-button';
export type {
  SplitButtonAppearance,
  SplitButtonProps,
  SplitButtonState,
} from './components/split-button';
export { SidebarNavigationItem } from './components/sidebar-navigation-item';
export type {
  SidebarNavigationItemState,
  SidebarNavigationItemProps,
} from './components/sidebar-navigation-item';
export { Sidebar } from './components/sidebar';
export type { SidebarProps, SidebarState } from './components/sidebar';
export { TableColumn, TableRow } from './components/table';
export {
  TableCellEmptyState,
  TableCellSingleChoice,
  TableCellTextContent,
  TableCellBadge,
  TableCellSplitButton,
  TableCellSlotCentered,
  TableCellSlotLeftAligned,
  TableCellInlineEdit,
} from './components/table-cell';
export type {
  TableCellState,
  TableCellEmptyStateProps,
  TableCellSingleChoiceProps,
  TableCellTextContentProps,
  TableCellBadgeProps,
  TableCellSplitButtonProps,
  TableCellSlotCenteredProps,
  TableCellSlotLeftAlignedProps,
  TableCellInlineEditProps,
} from './components/table-cell';
export { TabGroup, TabGroupContext, useTabGroupContext } from './components/tab-group';
export type { TabGroupContextValue, TabGroupProps } from './components/tab-group';
export { TabItem } from './components/tab-item';
export type { TabItemProps, TabItemState } from './components/tab-item';
export { Label } from './components/label';
export type { LabelProps, LabelState } from './components/label';
export { Modal, ModalButtonClose, ModalDialog, ModalFooterActions } from './components/modal';
export type { ModalButtonCloseProps, ModalDialogProps, ModalProps } from './components/modal';
export { StatusLabel } from './components/status-label';
export type {
  StatusLabelAppearance,
  StatusLabelProps,
  StatusLabelSize,
  StatusLabelStatus,
} from './components/status-label';
export { StatusMark } from './components/status-mark';
export type {
  StatusMarkAppearance,
  StatusMarkProps,
  StatusMarkSize,
} from './components/status-mark';
export { Avatar } from './components/avatar';
export type { AvatarProps, AvatarState } from './components/avatar';

// Patterns — molecules
// ...

// Layouts — primitives
export { Stack } from './layouts/stack';
export type { StackProps } from './layouts/stack';
export { Cluster } from './layouts/cluster';
export type { ClusterProps } from './layouts/cluster';
export { Grid } from './layouts/grid';
export type { GridProps } from './layouts/grid';
