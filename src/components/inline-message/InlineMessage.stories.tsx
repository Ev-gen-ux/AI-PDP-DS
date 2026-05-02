import type { Meta, StoryObj } from '@storybook/react';
import { InlineMessage } from './InlineMessage';

const meta = {
  title: 'Components/InlineMessage',
  component: InlineMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Вспомогательное текстовое сообщение под полем ввода: подсказка или ошибка.',
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
    message: 'Help message',
    status: 'default',
  },
  argTypes: {
    message: { control: 'text', description: 'Текст сообщения.' },
    status: {
      control: 'inline-radio',
      options: ['default', 'error', 'success'],
      description: 'Тип сообщения: подсказка, ошибка или успех.',
    },
  },
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'default',
    message: 'Help message',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    message: 'Error message',
  },
  parameters: {
    docs: {
      description: {
        story: 'Сообщение об ошибке для невалидного состояния поля.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    status: 'success',
    message: 'Success message',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Сообщение об успешной валидации или положительном результате (Figma: InlineMessage / success).',
      },
    },
  },
};
