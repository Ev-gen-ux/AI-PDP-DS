import type { Meta, StoryObj } from '@storybook/react';
import { DropdownList } from './DropdownList';

const meta = {
  title: 'Components/DropdownList',
  component: DropdownList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Контейнер выпадающего списка из элементов DropdownItem с elevation и token-first оформлением.',
      },
    },
  },
} satisfies Meta<typeof DropdownList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDisabledItem: Story = {
  args: {
    options: [
      { id: '1', label: 'Label', description: 'Description' },
      { id: '2', label: 'Label', description: 'Description' },
      { id: '3', label: 'Label', description: 'Description', disabled: true },
      { id: '4', label: 'Label', description: 'Description' },
    ],
  },
};
