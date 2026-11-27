import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Одиночный radio-контрол с поддержкой checked/invalid/disabled состояний и сообщений через InlineMessage.',
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
    label: 'Label',
    invalid: false,
    disabled: false,
    state: 'enabled',
    helpMessage: 'Help message',
    errorMessage: 'Error message',
    required: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Текст подписи radio-контрола.',
    },
    checked: {
      control: 'boolean',
      description: 'Выбранное состояние (для контролируемого сценария).',
    },
    invalid: {
      control: 'boolean',
      description: 'Состояние ошибки.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключенное состояние.',
    },
    state: {
      control: 'inline-radio',
      options: ['enabled', 'focus', 'disabled'],
      description: 'Фиксированное визуальное состояние для демонстрационных stories.',
    },
    helpMessage: {
      control: 'text',
      description: 'Подсказка под компонентом.',
    },
    errorMessage: {
      control: 'text',
      description: 'Сообщение об ошибке (показывается при invalid=true).',
    },
    required: {
      control: 'boolean',
      description: 'Показывает обязательность поля в Label.',
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    invalid: false,
    disabled: false,
    state: 'enabled',
    helpMessage: 'Help message',
    errorMessage: 'Error message',
    required: false,
  },
  argTypes: {
    state: {
      control: false,
      table: { disable: true },
    },
    checked: {
      control: false,
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Интерактивная story: checked переключается кликом, focus проверяется с клавиатуры, ошибки и disabled меняются через controls.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Radio state="enabled" checked={false} label="Label" />
      <Radio state="enabled" checked label="Label" />
      <Radio state="enabled" checked={false} invalid label="Label" />
      <Radio state="enabled" checked invalid label="Label" />
      <Radio state="focus" checked={false} label="Label" />
      <Radio state="focus" checked label="Label" />
      <Radio state="focus" checked={false} invalid label="Label" />
      <Radio state="focus" checked invalid label="Label" />
      <Radio state="disabled" checked={false} disabled label="Label" />
      <Radio state="disabled" checked disabled label="Label" />
      <Radio state="disabled" checked={false} disabled invalid label="Label" />
      <Radio state="disabled" checked disabled invalid label="Label" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
