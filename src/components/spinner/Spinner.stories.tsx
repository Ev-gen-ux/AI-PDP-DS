import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';
import { Cluster } from '@/layouts/cluster';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 24,
  },
  argTypes: {
    size: { control: 'inline-radio', options: [16, 24] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <Cluster gap="related">
      <Spinner size={16} />
      <Spinner size={24} />
    </Cluster>
  ),
};
