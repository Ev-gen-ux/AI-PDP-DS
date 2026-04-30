import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Навигационная цепочка из breadcrumb-item и кнопки more. Поддерживает состояния item: enabled/hover/active/current и more: default/hover/active.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const ItemStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Breadcrumbs
        items={[
          { type: 'item', label: 'root', state: 'enabled' },
          { type: 'item', label: 'current', current: true, state: 'current' },
        ]}
      />
      <Breadcrumbs
        items={[
          { type: 'item', label: 'root', state: 'hover' },
          { type: 'item', label: 'current', current: true, state: 'current' },
        ]}
      />
      <Breadcrumbs
        items={[
          { type: 'item', label: 'root', state: 'active' },
          { type: 'item', label: 'current', current: true, state: 'current' },
        ]}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const MoreStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Breadcrumbs
        items={[
          { type: 'item', label: 'root' },
          { type: 'more', state: 'default' },
          { type: 'item', label: 'current', current: true, state: 'current' },
        ]}
      />
      <Breadcrumbs
        items={[
          { type: 'item', label: 'root' },
          { type: 'more', state: 'hover' },
          { type: 'item', label: 'current', current: true, state: 'current' },
        ]}
      />
      <Breadcrumbs
        items={[
          { type: 'item', label: 'root' },
          { type: 'more', state: 'active' },
          { type: 'item', label: 'current', current: true, state: 'current' },
        ]}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
