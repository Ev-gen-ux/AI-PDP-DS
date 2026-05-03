import type { Meta, StoryObj } from '@storybook/react';
import { InputEmail } from './InputEmail';

const meta = {
  title: 'Components/InputEmail',
  component: InputEmail,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле email с иконкой конверта, семантикой `colors.inputEmail` (Figma InputEmail, node 3392:29755). Рамка success — при `success={true}` (валидное значение).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <div style={{ width: '320px' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    label: 'Label',
    placeholder: 'email@example.com',
    defaultValue: '',
    required: false,
    disabled: false,
    readOnly: false,
    invalid: false,
    success: false,
    helpMessage: 'Help message',
    errorMessage: 'Error message',
  },
  argTypes: {
    label: { control: 'text', description: 'Текст метки поля.' },
    placeholder: { control: 'text', description: 'Плейсхолдер.' },
    defaultValue: {
      control: 'text',
      description: 'Начальное значение в неконтролируемом режиме.',
    },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    success: {
      control: 'boolean',
      description: 'Рамка успеха (зелёная), как состояние «value» в макете.',
    },
    helpMessage: { control: 'text' },
    errorMessage: { control: 'text', description: 'Показывается при invalid=true.' },
  },
} satisfies Meta<typeof InputEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  parameters: {
    docs: {
      description: { story: 'Наведение на поле.' },
    },
    pseudo: { hover: true },
  },
};

export const Focus: Story = {
  args: {
    label: 'Focus',
    defaultValue: '',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  },
  parameters: {
    docs: {
      description: { story: 'Фокус на поле ввода.' },
    },
  },
};

export const WithValueSuccess: Story = {
  args: {
    defaultValue: 'email@example.com',
    success: true,
  },
  parameters: {
    docs: {
      description: { story: 'Заполненное поле с рамкой success и кнопкой очистки.' },
    },
  },
};

export const Invalid: Story = {
  args: {
    label: 'Invalid',
    defaultValue: 'not-an-email',
    invalid: true,
    errorMessage: 'Error message',
  },
  parameters: {
    docs: {
      description: { story: 'Ошибка валидации и сообщение под полем.' },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    helpMessage: 'Help message',
  },
  parameters: {
    docs: {
      description: { story: 'Отключённое поле (рамка 2px по макету).' },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Read only',
    defaultValue: 'user@example.com',
    readOnly: true,
  },
  parameters: {
    docs: {
      description: { story: 'Только чтение.' },
    },
  },
};
