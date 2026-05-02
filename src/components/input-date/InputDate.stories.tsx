import type { Meta, StoryObj } from '@storybook/react';
import { InputDate } from './InputDate';

const meta = {
  title: 'Components/InputDate',
  component: InputDate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле выбора даты на базе нативного input type="date" с иконкой календаря и сообщениями под полем.',
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
    placeholder: 'дд.мм.гггг',
    defaultValue: '',
    required: false,
    disabled: false,
    invalid: false,
    helpMessage: 'Help message',
    errorMessage: 'Error message',
  },
  argTypes: {
    label: { control: 'text', description: 'Текст метки поля.' },
    placeholder: {
      control: 'text',
      description: 'Текст подсказки при пустом значении (визуально, не HTML placeholder).',
    },
    defaultValue: {
      control: 'text',
      description: 'Начальное значение (YYYY-MM-DD) в неконтролируемом режиме.',
    },
    required: { control: 'boolean', description: 'Обязательное поле.' },
    disabled: { control: 'boolean', description: 'Блокирует поле и кнопку календаря.' },
    invalid: { control: 'boolean', description: 'Состояние ошибки (бордер и сообщение).' },
    helpMessage: { control: 'text', description: 'Подсказка под полем.' },
    errorMessage: {
      control: 'text',
      description: 'Текст ошибки; показывается при invalid=true.',
    },
  },
} satisfies Meta<typeof InputDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Состояние наведения на поле.',
      },
    },
    pseudo: { hover: true },
  },
};

export const Focus: Story = {
  args: {
    label: 'Focus',
    defaultValue: '2024-06-15',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="date"]');
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Фокус на поле ввода даты.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: '2024-06-15',
  },
  parameters: {
    docs: {
      description: {
        story: 'Заполненное значение (формат отображения зависит от браузера).',
      },
    },
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: '2024-06-15',
    errorMessage: 'Error message',
  },
  parameters: {
    docs: {
      description: {
        story: 'Ошибка валидации с текстом под полем.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Недоступное поле.',
      },
    },
  },
};
