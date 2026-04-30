import type { Meta, StoryObj } from '@storybook/react';
import { TableColumn } from './TableColumn';

const meta = {
  title: 'Components/Table/TableColumn',
  component: TableColumn,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', overflowX: 'auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableColumn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
