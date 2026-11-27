import type { Meta, StoryObj } from '@storybook/react';
import { ButtonLink } from './ButtonLink';

const meta = {
  title: 'Components/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Текстовая кнопка-ссылка с appearance primary/secondary, опциональными иконками слева/справа и состоянием loading.',
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
    state: 'enabled',
    loading: false,
    disabled: false,
    iconBefore: true,
    iconAfter: true,
    text: 'Link Label',
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Визуальный вариант link-кнопки.',
    },
    state: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active', 'focus', 'disabled'],
      description: 'Фиксированное визуальное состояние для демонстрации master-state.',
    },
    loading: {
      control: 'boolean',
      description: 'Показывает spinner вместо текста и иконок.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает взаимодействие с кнопкой.',
    },
    iconBefore: {
      control: 'boolean',
      description: 'Показывает link-иконку слева.',
    },
    iconAfter: {
      control: 'boolean',
      description: 'Показывает link-иконку справа.',
    },
    text: {
      control: 'text',
      description: 'Текст компонента.',
    },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appearance: 'primary',
    state: 'enabled',
    loading: false,
    disabled: false,
    iconBefore: true,
    iconAfter: true,
    text: 'Link Label',
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
          'Интерактивная story: hover/active/focus проверяются реальным взаимодействием мыши/клавиатуры, appearance переключается через controls.',
      },
    },
  },
};

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <ButtonLink appearance="primary" state="enabled" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="primary" state="hover" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="primary" state="active" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="primary" state="focus" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="primary" state="disabled" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="primary" loading />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Secondary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <ButtonLink appearance="secondary" state="enabled" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="secondary" state="hover" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="secondary" state="active" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="secondary" state="focus" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="secondary" state="disabled" iconBefore iconAfter text="Link Label" />
      <ButtonLink appearance="secondary" loading />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
