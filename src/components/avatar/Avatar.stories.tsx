import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Компактный аватар с инициалами и встроенным маркером присутствия через компонент StatusMark.',
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
  args: {
    initials: 'ЕВ',
    state: 'enabled',
    showStatusMark: true,
  },
  argTypes: {
    initials: {
      control: 'text',
      description: 'Инициалы пользователя в центре аватара.',
    },
    state: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active'],
      description: 'Визуальное состояние аватара из master-компонента Figma.',
    },
    showStatusMark: {
      control: 'boolean',
      description: 'Показывать маркер онлайн-статуса (StatusMark) в правом нижнем углу.',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  args: {
    state: 'enabled',
  },
};

export const Hover: Story = {
  args: {
    state: 'hover',
  },
};

export const Active: Story = {
  args: {
    state: 'active',
  },
};
