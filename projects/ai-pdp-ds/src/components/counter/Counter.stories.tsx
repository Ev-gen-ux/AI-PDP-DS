import type { Meta, StoryObj } from '@storybook/react';
import { Counter } from './Counter';

const meta = {
  title: 'Components/Counter',
  component: Counter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Счётчик (бейдж числа): варианты `primary` (спокойный фон) и `secondary` (контрастный), размеры как в Figma. Значения выше 99 и 999 отображаются как `99+` и `999+`.',
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
    value: 3,
    appearance: 'primary' as const,
    size: 'extra small (16px)' as const,
  },
  argTypes: {
    value: { control: 'number', description: 'Число (неотрицательное).' },
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Соответствует варианту Appearance в Figma.',
    },
    size: {
      control: 'inline-radio',
      options: ['extra small (16px)', 'small (24px)'],
      description: 'Размер как в Figma (Size).',
    },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    value: 3,
    appearance: 'primary',
    size: 'extra small (16px)',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Counter appearance="primary" size="extra small (16px)" value={0} />
      <Counter appearance="primary" size="extra small (16px)" value={8} />
      <Counter appearance="primary" size="extra small (16px)" value={42} />
      <Counter appearance="primary" size="extra small (16px)" value={150} />
      <Counter appearance="primary" size="extra small (16px)" value={1200} />
      <Counter appearance="primary" size="small (24px)" value={0} />
      <Counter appearance="primary" size="small (24px)" value={42} />
      <Counter appearance="primary" size="small (24px)" value={150} />
      <Counter appearance="primary" size="small (24px)" value={1200} />
    </div>
  ),
};

export const Secondary: Story = {
  args: {
    value: 3,
    appearance: 'secondary',
    size: 'extra small (16px)',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Counter appearance="secondary" size="extra small (16px)" value={0} />
      <Counter appearance="secondary" size="extra small (16px)" value={42} />
      <Counter appearance="secondary" size="extra small (16px)" value={150} />
      <Counter appearance="secondary" size="extra small (16px)" value={1200} />
      <Counter appearance="secondary" size="small (24px)" value={42} />
      <Counter appearance="secondary" size="small (24px)" value={1200} />
    </div>
  ),
};
