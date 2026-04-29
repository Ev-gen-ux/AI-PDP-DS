// AI-PDP-DS — public API entry point
// Импортируйте компоненты из корня пакета: import { Button } from '@ev-gen-ux/ai-pdp-ds';

// Theme
export { theme } from './theme/tokens';
export type { Theme } from './theme/tokens';

// Components — atoms
export { Button } from './components/button';
export type { ButtonProps } from './components/button';
export { InputText } from './components/input-text';
export type { InputTextProps } from './components/input-text';
export { InlineMessage } from './components/inline-message';
export type { InlineMessageProps, InlineMessageStatus } from './components/inline-message';
export { Icon } from './components/icon';
export type { IconProps, IconSize } from './components/icon';
export { Spinner } from './components/spinner';
export type { SpinnerProps, SpinnerSize } from './components/spinner';
export { Label } from './components/label';
export type { LabelProps, LabelState } from './components/label';
export { StatusLabel } from './components/status-label';
export type {
  StatusLabelAppearance,
  StatusLabelProps,
  StatusLabelSize,
  StatusLabelStatus,
} from './components/status-label';
export { StatusMark } from './components/status-mark';
export type { StatusMarkProps, StatusMarkSize } from './components/status-mark';

// Patterns — molecules
// ...

// Layouts — primitives
export { Stack } from './layouts/stack';
export type { StackProps } from './layouts/stack';
export { Cluster } from './layouts/cluster';
export type { ClusterProps } from './layouts/cluster';
export { Grid } from './layouts/grid';
export type { GridProps } from './layouts/grid';
