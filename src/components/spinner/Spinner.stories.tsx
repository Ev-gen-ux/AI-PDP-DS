import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Индикатор загрузки: кольцо с градиентом по обводке и непрерывным вращением. Размеры и цвет из токенов темы.',
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
    size: 24,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: [16, 24, 32, 40],
      description: 'Диаметр спиннера (пиксели), согласно вариантам в Figma.',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 24,
  },
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={32} />
      <Spinner size={40} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Все размеры из мастер-компонента: 16, 24, 32 и 40 px.',
      },
    },
  },
};
