import type { Meta, StoryObj } from '@storybook/react';
import { Chips } from './Chips';

const meta = {
  title: 'Components/Chips',
  component: Chips,
  tags: ['autodocs'],
  args: {
    state: 'enabled',
    size: 'small (32px)',
    iconBefore: false,
    closable: false,
    label: 'Chips Label',
    disabled: false,
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['enabled', 'hover', 'active', 'focus', 'disabled'],
      description: 'Forced visual state for parity with master variants.',
    },
    size: {
      control: 'select',
      options: ['small (32px)', 'extra small (24px)'],
      description: 'Size labels match Figma master variant names 1:1.',
    },
    iconBefore: {
      control: 'boolean',
    },
    closable: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', display: 'flex', alignItems: 'flex-start' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Chip-компонент с опциональными leading/close иконками и размерами из мастер-компонента Figma.',
      },
    },
  },
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SmallStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Chips size="small (32px)" state="enabled" iconBefore closable />
      <Chips size="small (32px)" state="hover" iconBefore closable />
      <Chips size="small (32px)" state="active" iconBefore closable />
      <Chips size="small (32px)" state="focus" iconBefore closable />
      <Chips size="small (32px)" state="disabled" iconBefore closable />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ExtraSmallStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Chips size="extra small (24px)" state="enabled" iconBefore closable />
      <Chips size="extra small (24px)" state="hover" iconBefore closable />
      <Chips size="extra small (24px)" state="active" iconBefore closable />
      <Chips size="extra small (24px)" state="focus" iconBefore closable />
      <Chips size="extra small (24px)" state="disabled" iconBefore closable />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
