import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Cluster } from '@/layouts/cluster';
import { Stack } from '@/layouts/stack';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    text: 'Button',
    appearance: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['primary', 'outline', 'flat'] },
    size: { control: 'inline-radio', options: ['large', 'medium'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <Stack gap="grouped">
      <Cluster gap="related">
        <Button {...args} appearance="primary" size="large" text="Primary / Large" />
        <Button {...args} appearance="outline" size="large" text="Outline / Large" />
        <Button {...args} appearance="flat" size="large" text="Flat / Large" />
      </Cluster>
      <Cluster gap="related">
        <Button {...args} appearance="primary" size="medium" text="Primary / Medium" />
        <Button {...args} appearance="outline" size="medium" text="Outline / Medium" />
        <Button {...args} appearance="flat" size="medium" text="Flat / Medium" />
      </Cluster>
      <Cluster gap="related">
        <Button {...args} appearance="primary" disabled text="Disabled" />
        <Button {...args} appearance="outline" loading text="Loading" />
      </Cluster>
    </Stack>
  ),
};
