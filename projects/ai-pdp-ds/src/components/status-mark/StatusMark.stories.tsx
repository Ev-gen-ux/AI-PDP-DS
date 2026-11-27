import type { Meta, StoryObj } from '@storybook/react';
import { StatusMark, type StatusMarkAppearance } from './StatusMark';

const meta = {
  title: 'Components/StatusMark',
  component: StatusMark,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Компактный маркер статуса для аватара и других индикаторов: success (скруглённый прямоугольник), остальные варианты — круг.',
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
    appearance: 'success',
    size: 'Extra Extra Small 8px',
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['success', 'error', 'alert', 'information', 'wait'],
      description: 'Вариант маркера статуса.',
    },
    size: {
      control: 'inline-radio',
      options: ['Extra Extra Small 8px', 'Extra Small 12px', 'Small 16px'],
      description: 'Размер маркера из мастер-компонента Figma.',
    },
  },
} satisfies Meta<typeof StatusMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const sizes = ['Extra Extra Small 8px', 'Extra Small 12px', 'Small 16px'] as const;

function columnForAppearance(appearance: StatusMarkAppearance) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      {sizes.map((size) => (
        <StatusMark key={size} appearance={appearance} size={size} />
      ))}
    </div>
  );
}

export const Success: Story = {
  render: () => columnForAppearance('success'),
};

export const Error: Story = {
  render: () => columnForAppearance('error'),
};

export const Alert: Story = {
  render: () => columnForAppearance('alert'),
};

export const Information: Story = {
  render: () => columnForAppearance('information'),
};

export const Wait: Story = {
  render: () => columnForAppearance('wait'),
};
