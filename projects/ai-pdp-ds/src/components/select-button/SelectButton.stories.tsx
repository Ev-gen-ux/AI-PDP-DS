import type { Meta, StoryObj } from '@storybook/react';
import { SelectButton } from './SelectButton';

const meta = {
  title: 'Components/SelectButton',
  component: SelectButton,
  tags: ['autodocs'],
  args: {
    state: 'enabled',
    size: 'small (32px)',
    disabled: false,
    placeholder: 'selectButton',
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active', 'focus', 'disabled'],
      description: 'Forced visual state for parity with master variants.',
    },
    size: {
      control: 'inline-radio',
      options: ['small (32px)', 'extra small (24px)'],
      description: 'Size labels match Figma master variant names 1:1.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 160px 24px', overflow: 'visible' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: 'enabled',
    size: 'small (32px)',
  },
};

export const SmallStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, overflow: 'visible' }}>
      <SelectButton size="small (32px)" state="enabled" />
      <SelectButton size="small (32px)" state="hover" />
      <SelectButton size="small (32px)" state="active" />
      <SelectButton size="small (32px)" state="focus" />
      <SelectButton size="small (32px)" state="disabled" disabled />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ExtraSmallStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, overflow: 'visible' }}>
      <SelectButton size="extra small (24px)" state="enabled" />
      <SelectButton size="extra small (24px)" state="hover" />
      <SelectButton size="extra small (24px)" state="active" />
      <SelectButton size="extra small (24px)" state="focus" />
      <SelectButton size="extra small (24px)" state="disabled" disabled />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
