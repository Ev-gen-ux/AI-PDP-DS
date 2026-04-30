import type { Meta, StoryObj } from '@storybook/react';
import { DropdownItem } from './DropdownItem';

const meta = {
  title: 'Components/DropdownItem',
  component: DropdownItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 248, padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Label',
    description: 'Description',
    state: 'enabled',
    disabled: false,
    iconBefore: false,
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active', 'disabled'],
    },
    iconBefore: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof DropdownItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    state: {
      control: false,
      table: { disable: true },
    },
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: 248 }}>
      <DropdownItem state="enabled" label="Label" description="Description" />
      <DropdownItem state="hover" label="Label" description="Description" />
      <DropdownItem state="active" label="Label" description="Description" />
      <DropdownItem state="disabled" label="Label" description="Description" disabled />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
