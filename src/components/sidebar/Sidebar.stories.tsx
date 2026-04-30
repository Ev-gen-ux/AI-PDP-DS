import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    state: 'default',
    contentHeader: true,
    contentBody: true,
    contentFooter: true,
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['default', 'collapse'],
      description: 'Состояние ширины сайдбара.',
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <Sidebar state="default" />
      <Sidebar state="collapse" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
