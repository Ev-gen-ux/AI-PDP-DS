import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Текстовая метка для полей ввода с поддержкой обязательности и визуальных состояний.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    text: 'Label',
    required: false,
    state: 'default',
  },
  argTypes: {
    text: { control: 'text', description: 'Текст метки.' },
    state: {
      control: 'inline-radio',
      options: ['default', 'disabled', 'readOnly'],
      description: 'Визуальное состояние метки.',
    },
    required: { control: 'boolean', description: 'Добавляет индикатор обязательного поля.' },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Label',
    state: 'default',
  },
};

export const Required: Story = {
  args: {
    text: 'Label',
    state: 'default',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Метка с индикатором обязательного поля.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    text: 'Label',
    state: 'disabled',
  },
};

export const ReadOnly: Story = {
  args: {
    text: 'Label',
    state: 'readOnly',
  },
};
