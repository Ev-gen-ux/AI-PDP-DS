import type { Meta, StoryObj } from '@storybook/react';
import { InlineMessage } from './InlineMessage';
import { Stack } from '@/layouts/stack';

const meta = {
  title: 'Components/InlineMessage',
  component: InlineMessage,
  tags: ['autodocs'],
  args: {
    message: 'Help message',
    status: 'default',
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['default', 'error'] },
  },
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="close">
      <InlineMessage status="default" message="Help message" />
      <InlineMessage status="error" message="Error message" />
    </Stack>
  ),
};
