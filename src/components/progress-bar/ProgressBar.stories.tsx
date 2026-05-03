import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Горизонтальный индикатор: дорожка и заливка на токенах `progressBar.background.*`, высота `spacing.height.4xSmall`. При `indeterminate` сегмент ~40% ширины движется по дорожке (имитация загрузки).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px', width: 'min(100%, 360px)' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    value: 40,
    max: 100,
    indeterminate: false,
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Текущее значение (игнорируется при `indeterminate`).',
    },
    max: { control: 'number', description: 'Максимум шкалы (`aria-valuemax`).' },
    indeterminate: {
      control: 'boolean',
      description: 'Горизонтальная анимация без известного процента.',
    },
    'aria-label': { control: 'text', description: 'Подпись для вспомогательных технологий.' },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Steps: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 12,
        width: 360,
      }}
    >
      <ProgressBar value={0} aria-label="0 percent" />
      <ProgressBar value={20} aria-label="20 percent" />
      <ProgressBar value={40} aria-label="40 percent" />
      <ProgressBar value={60} aria-label="60 percent" />
      <ProgressBar value={80} aria-label="80 percent" />
      <ProgressBar value={100} aria-label="100 percent" />
    </div>
  ),
};

export const CustomScale: Story = {
  args: {
    value: 3,
    max: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Шкала 0–10: процент заливки считается как `value / max`.',
      },
    },
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    'aria-label': 'Loading',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Сегмент движется по горизонтали туда-обратно (`alternate`), пока неизвестен прогресс.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px', width: 360 }}>
        <Story />
      </div>
    ),
  ],
};
