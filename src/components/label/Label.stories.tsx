import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/layouts/stack';
import { Label } from './Label';

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    text: 'Label',
    required: false,
    state: 'default',
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'disabled', 'readOnly'] },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="close">
      <Label text="Label" state="default" />
      <Label text="Label" state="default" required />
      <Label text="Label" state="disabled" />
      <Label text="Label" state="readOnly" />
    </Stack>
  ),
};
