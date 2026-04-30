import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { SidebarNavigationItem } from './SidebarNavigationItem';

const meta = {
  title: 'Components/SidebarNavigationItem',
  component: SidebarNavigationItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 280, padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    state: 'enabled',
    label: true,
    labelText: 'Nav Label',
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active'],
    },
  },
} satisfies Meta<typeof SidebarNavigationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [{ state }, updateArgs] = useArgs<typeof args>();

    const handleMouseEnter = () => {
      if (state !== 'active') {
        updateArgs({ state: 'hover' });
      }
    };

    const handleMouseLeave = () => {
      if (state !== 'active') {
        updateArgs({ state: 'enabled' });
      }
    };

    const handleClick = () => {
      updateArgs({ state: state === 'active' ? 'enabled' : 'active' });
    };

    return (
      <SidebarNavigationItem
        {...args}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <SidebarNavigationItem state="enabled" />
      <SidebarNavigationItem state="hover" />
      <SidebarNavigationItem state="active" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
