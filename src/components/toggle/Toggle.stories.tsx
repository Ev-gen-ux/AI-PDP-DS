import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Переключатель (switch) с токенами `colors.toggle.*`, подписью `Label` и опциональным `InlineMessage`. Мастер Figma: [toggle · 3415:32200](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-32200).',
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
    checked: false,
    invalid: false,
    disabled: false,
    state: 'enabled',
    inlineMessage: true,
    helpMessage: 'Help message',
    errorMessage: 'Error message',
    required: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Текст подписи.',
    },
    checked: {
      control: 'boolean',
      description: 'Включено (on).',
    },
    invalid: {
      control: 'boolean',
      description: 'Состояние ошибки.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключено.',
    },
    state: {
      control: 'inline-radio',
      options: ['enabled', 'focus', 'disabled'],
      description: 'Фиксированное визуальное состояние для демо stories.',
    },
    inlineMessage: {
      control: 'boolean',
      description: 'Показывает InlineMessage в default-сценарии.',
    },
    helpMessage: {
      control: 'text',
      description: 'Подсказка под компонентом.',
    },
    errorMessage: {
      control: 'text',
      description: 'Сообщение об ошибке (при invalid=true).',
    },
    required: {
      control: 'boolean',
      description: 'Обязательное поле в Label.',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [{ checked }, updateArgs] = useArgs();
    return (
      <Toggle
        {...args}
        checked={Boolean(checked)}
        onChange={(event) => updateArgs({ checked: event.target.checked })}
      />
    );
  },
  argTypes: {
    state: {
      control: false,
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Интерактивная story: положение переключается кликом; focus проверяется с клавиатуры (Tab).',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Toggle state="enabled" checked={false} label="Label" inlineMessage={false} />
      <Toggle state="enabled" checked label="Label" inlineMessage={false} />
      <Toggle state="enabled" checked={false} invalid label="Label" />
      <Toggle state="enabled" checked invalid label="Label" />
      <Toggle state="focus" checked={false} label="Label" inlineMessage={false} />
      <Toggle state="focus" checked label="Label" inlineMessage={false} />
      <Toggle state="focus" checked={false} invalid label="Label" />
      <Toggle state="focus" checked invalid label="Label" />
      <Toggle state="disabled" checked={false} disabled label="Label" />
      <Toggle state="disabled" checked disabled label="Label" />
      <Toggle state="disabled" checked={false} disabled invalid label="Label" />
      <Toggle state="disabled" checked disabled invalid label="Label" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
