import type { Meta, StoryObj } from '@storybook/react';
import { INPUT_TEL_MASK_PLACEHOLDER } from './inputTelMask';
import { InputTel } from './InputTel';

const meta = {
  title: 'Components/InputTel',
  component: InputTel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Телефон RU: фиксированный префикс **+7** (`colors.inputTel.prefix`), маска национальной части **(999) 999 99 99** из [макета](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-29557), до **10 цифр** после +7; в `value` / `onChange` — только национальные цифры.',
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
    placeholder: INPUT_TEL_MASK_PLACEHOLDER,
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
    placeholder: {
      control: 'text',
      description: 'Плейсхолдер маски национальной части (по умолчанию из макета).',
    },
    defaultValue: {
      control: 'text',
      description: 'Начальные цифры (0–10), без +7 и без скобок.',
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
    defaultValue: '9123456789',
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
    defaultValue: '9123456789',
    readOnly: true,
  },
  parameters: {
    docs: {
      description: { story: 'Только чтение.' },
    },
  },
};
