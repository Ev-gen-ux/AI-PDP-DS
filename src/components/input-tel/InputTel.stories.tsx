import type { Meta, StoryObj } from '@storybook/react';
import { InputTel } from './InputTel';

const meta = {
  title: 'Components/InputTel',
  component: InputTel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле телефона с иконкой, семантикой `colors.inputTel` ([Figma InputTel](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-29557)). Рамка success — при `success={true}`.',
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
    placeholder: '+1 (555) 000-0000',
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
} satisfies Meta<typeof InputTel>;

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
    defaultValue: '+1 (555) 123-4567',
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
    defaultValue: 'abc',
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
    defaultValue: '+1 (555) 123-4567',
    readOnly: true,
  },
  parameters: {
    docs: {
      description: { story: 'Только чтение.' },
    },
  },
};
