import type { Meta, StoryObj } from '@storybook/react';
import { AirplaneTakeoffIcon, XIcon } from '@phosphor-icons/react';
import { Icon } from './Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    icon: AirplaneTakeoffIcon,
    size: 24,
  },
  argTypes: {
    size: { control: 'inline-radio', options: [16, 24] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Airplane24: Story = {
  args: {
    icon: AirplaneTakeoffIcon,
    size: 24,
  },
};

export const Airplane16: Story = {
  args: {
    icon: AirplaneTakeoffIcon,
    size: 16,
  },
};

export const Cross24: Story = {
  args: {
    icon: XIcon,
    size: 24,
  },
};

export const Cross16: Story = {
  args: {
    icon: XIcon,
    size: 16,
  },
};
