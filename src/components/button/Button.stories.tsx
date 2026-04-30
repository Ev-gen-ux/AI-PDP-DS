import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Button primary - самая заметная кнопка для ключевого действия на экране.',
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
    text: 'Button',
    appearance: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'outline', 'flat'],
      description: 'Визуальный вес компонента.',
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small'],
      description: 'Размер компонента.',
    },
    disabled: {
      control: 'boolean',
      description: 'Заблокированное состояние.',
    },
    loading: {
      control: 'boolean',
      description: 'Состояние загрузки.',
    },
    iconBefore: {
      control: 'boolean',
      description: 'Включает иконку слева.',
    },
    iconAfter: {
      control: 'boolean',
      description: 'Включает иконку справа.',
    },
    text: {
      control: 'text',
      description: 'Текст в кнопке.',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    appearance: 'primary',
    text: 'Hello Primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Самая заметная кнопка для ключевого действия на экране.',
      },
    },
  },
};

export const Outline: Story = {
  args: {
    appearance: 'outline',
    text: 'Hello Outline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Средний визуальный акцент для вторичного действия.',
      },
    },
  },
};

export const Flat: Story = {
  args: {
    appearance: 'flat',
    text: 'Hello Flat',
  },
  parameters: {
    docs: {
      description: {
        story: 'Минимальный визуальный акцент для нейтрального действия.',
      },
    },
  },
};
