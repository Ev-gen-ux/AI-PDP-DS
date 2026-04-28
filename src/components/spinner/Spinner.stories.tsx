import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    size: 24,
  },
  argTypes: {
    size: { control: 'inline-radio', options: [16, 24] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Size24: Story = {
  args: {
    size: 24,
  },
};

export const Size16: Story = {
  args: {
    size: 16,
  },
};
