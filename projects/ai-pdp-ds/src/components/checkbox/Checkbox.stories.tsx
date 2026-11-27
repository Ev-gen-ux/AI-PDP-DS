import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox-контрол с состояниями checked/indeterminate/invalid/disabled и сообщениями через InlineMessage.',
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
    indeterminate: false,
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
      description: 'Текст подписи checkbox.',
    },
    checked: {
      control: 'boolean',
      description: 'Выбранное состояние.',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Промежуточное состояние.',
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
      description: 'Сообщение об ошибке (показывается при invalid=true).',
    },
    required: {
      control: 'boolean',
      description: 'Показывает обязательность поля в Label.',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [{ checked }, updateArgs] = useArgs();
    return (
      <Checkbox
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
          'Интерактивная story: checked переключается кликом, indeterminate/invalid/disabled задаются controls, focus проверяется с клавиатуры.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Checkbox state="enabled" checked={false} label="Label" />
      <Checkbox state="enabled" checked label="Label" inlineMessage={false} />
      <Checkbox state="enabled" indeterminate label="Label" inlineMessage={false} />
      <Checkbox state="enabled" checked={false} invalid label="Label" />
      <Checkbox state="enabled" checked invalid label="Label" />
      <Checkbox state="enabled" indeterminate invalid label="Label" />
      <Checkbox state="focus" checked={false} label="Label" />
      <Checkbox state="focus" checked label="Label" />
      <Checkbox state="focus" indeterminate label="Label" />
      <Checkbox state="focus" checked={false} invalid label="Label" />
      <Checkbox state="focus" checked invalid label="Label" />
      <Checkbox state="focus" indeterminate invalid label="Label" />
      <Checkbox state="disabled" checked={false} disabled label="Label" />
      <Checkbox state="disabled" checked disabled label="Label" />
      <Checkbox state="disabled" indeterminate disabled label="Label" />
      <Checkbox state="disabled" checked={false} disabled invalid label="Label" />
      <Checkbox state="disabled" checked disabled invalid label="Label" />
      <Checkbox state="disabled" indeterminate disabled invalid label="Label" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
