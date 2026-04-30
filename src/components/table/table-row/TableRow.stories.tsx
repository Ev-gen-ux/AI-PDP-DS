import type { Meta, StoryObj } from '@storybook/react';
import { TableRow } from './TableRow';

const meta = {
  title: 'Components/Table/TableRow',
  component: TableRow,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', overflowX: 'auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
