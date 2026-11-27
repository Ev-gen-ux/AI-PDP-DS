import type { Meta, StoryObj } from '@storybook/react';
import { InputSearch } from './InputSearch';

const meta = {
  title: 'Components/InputSearch',
  component: InputSearch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле поиска с иконкой лупы, семантикой `colors.inputSearch` и общими границами/фокусом как у `input` (Figma InputSearch).',
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
    placeholder: 'Placeholder',
    defaultValue: '',
    required: false,
    disabled: false,
    readOnly: false,
    invalid: false,
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
    helpMessage: { control: 'text' },
    errorMessage: { control: 'text', description: 'Показывается при invalid=true.' },
  },
} satisfies Meta<typeof InputSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  parameters: {
    docs: {
      description: { story: 'Наведение на поле (pseudo.hover в поддерживаемых средах).' },
    },
    pseudo: { hover: true },
  },
};

export const Focus: Story = {
  args: {
    label: 'Focus',
    defaultValue: 'Query',
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

export const WithValue: Story = {
  args: {
    defaultValue: 'Search query',
  },
  parameters: {
    docs: {
      description: { story: 'Заполненное поле; доступна кнопка очистки.' },
    },
  },
};

export const Invalid: Story = {
  args: {
    label: 'Invalid',
    defaultValue: 'Bad',
    invalid: true,
    errorMessage: 'Error message',
  },
  parameters: {
    docs: {
      description: { story: 'Состояние ошибки и сообщение под полем.' },
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
      description: { story: 'Отключённое поле (толщина рамки 2px по макету).' },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Read only',
    defaultValue: 'Saved query',
    readOnly: true,
  },
  parameters: {
    docs: {
      description: { story: 'Только чтение, как у InputText.' },
    },
  },
};
