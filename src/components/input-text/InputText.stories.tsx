import type { Meta, StoryObj } from '@storybook/react';
import { InputText } from './InputText';

const meta = {
  title: 'Components/InputText',
  component: InputText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Текстовое поле для ввода данных с поддержкой состояний, подсказки и сообщения об ошибке.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px' }}>
        <div style={{ width: '320px' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
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
    placeholder: { control: 'text', description: 'Текст-подсказка в пустом поле.' },
    defaultValue: {
      control: 'text',
      description: 'Начальное значение для неконтролируемого режима.',
    },
    required: { control: 'boolean', description: 'Отмечает поле как обязательное.' },
    disabled: { control: 'boolean', description: 'Блокирует поле и взаимодействие с ним.' },
    readOnly: {
      control: 'boolean',
      description: 'Поле доступно для копирования, но недоступно для редактирования.',
    },
    invalid: { control: 'boolean', description: 'Переключает поле в состояние ошибки.' },
    success: { control: 'boolean', description: 'Переключает поле в успешное состояние.' },
    helpMessage: { control: 'text', description: 'Дополнительная подсказка под полем.' },
    errorMessage: {
      control: 'text',
      description: 'Сообщение об ошибке; имеет приоритет над helpMessage при invalid=true.',
    },
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

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
    defaultValue: 'Placeholder',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние фокуса для сценариев ввода с клавиатуры.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Placeholder',
  },
  parameters: {
    docs: {
      description: {
        story: 'Поле с предзаполненным значением.',
      },
    },
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: 'Placeholder',
    errorMessage: 'Error message',
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние ошибки с отображением errorMessage.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    success: true,
    defaultValue: 'Placeholder',
  },
  parameters: {
    docs: {
      description: {
        story: 'Успешное состояние после корректного ввода.',
      },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Placeholder',
  },
  parameters: {
    docs: {
      description: {
        story: 'Только чтение: редактирование недоступно, копирование доступно.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Полностью неактивное состояние поля.',
      },
    },
  },
};
