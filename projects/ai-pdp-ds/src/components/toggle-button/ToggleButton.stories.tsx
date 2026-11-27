import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from './ToggleButton';

const meta = {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка-переключатель с состоянием selected для appearance primary/secondary. Для secondary используется иконка sun.',
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
    appearance: 'primary',
    selected: false,
    loading: false,
    disabled: false,
    state: 'enabled',
    text: 'Toggle Button',
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Визуальный вариант компонента.',
    },
    selected: {
      control: 'boolean',
      description: 'Выбранное состояние toggle.',
    },
    loading: {
      control: 'boolean',
      description: 'Состояние загрузки с spinner.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает взаимодействие.',
    },
    state: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active', 'focus', 'disabled'],
      description: 'Фиксированное визуальное состояние для демонстрационных stories.',
    },
    text: {
      control: 'text',
      description: 'Текст для primary варианта.',
    },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appearance: 'primary',
    selected: false,
    loading: false,
    disabled: false,
    state: 'enabled',
    text: 'Toggle Button',
  },
  argTypes: {
    state: {
      control: false,
      table: { disable: true },
    },
  },
};

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <ToggleButton appearance="primary" state="enabled" selected={false} text="Toggle Button" />
      <ToggleButton appearance="primary" state="enabled" selected text="Toggle Button" />
      <ToggleButton appearance="primary" state="hover" selected={false} text="Toggle Button" />
      <ToggleButton appearance="primary" state="hover" selected text="Toggle Button" />
      <ToggleButton appearance="primary" state="active" selected={false} text="Toggle Button" />
      <ToggleButton appearance="primary" state="active" selected text="Toggle Button" />
      <ToggleButton appearance="primary" state="focus" selected={false} text="Toggle Button" />
      <ToggleButton appearance="primary" state="focus" selected text="Toggle Button" />
      <ToggleButton appearance="primary" state="disabled" selected={false} text="Toggle Button" />
      <ToggleButton appearance="primary" state="disabled" selected text="Toggle Button" />
      <ToggleButton appearance="primary" loading />
      <ToggleButton appearance="primary" loading selected />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Secondary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <ToggleButton appearance="secondary" state="enabled" selected={false} />
      <ToggleButton appearance="secondary" state="enabled" selected />
      <ToggleButton appearance="secondary" state="hover" selected={false} />
      <ToggleButton appearance="secondary" state="hover" selected />
      <ToggleButton appearance="secondary" state="active" selected={false} />
      <ToggleButton appearance="secondary" state="active" selected />
      <ToggleButton appearance="secondary" state="focus" selected={false} />
      <ToggleButton appearance="secondary" state="focus" selected />
      <ToggleButton appearance="secondary" state="disabled" selected={false} />
      <ToggleButton appearance="secondary" state="disabled" selected />
      <ToggleButton appearance="secondary" loading />
      <ToggleButton appearance="secondary" loading selected />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
