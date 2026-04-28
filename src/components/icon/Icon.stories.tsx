import type { Meta, StoryObj } from '@storybook/react';
import { AirplaneTakeoff, X } from '@phosphor-icons/react';
import { Icon } from './Icon';
import { Cluster } from '@/layouts/cluster';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    icon: AirplaneTakeoff,
    size: 24,
  },
  argTypes: {
    size: { control: 'inline-radio', options: [16, 24] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <Cluster gap="related">
      <Icon icon={AirplaneTakeoff} size={16} />
      <Icon icon={AirplaneTakeoff} size={24} />
      <Icon icon={X} size={16} />
      <Icon icon={X} size={24} />
    </Cluster>
  ),
};
