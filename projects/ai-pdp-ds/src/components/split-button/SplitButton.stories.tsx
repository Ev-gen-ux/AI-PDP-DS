import type { Meta, StoryObj } from '@storybook/react';
import { DropdownList } from '@/components/dropdown-list';
import { SplitButton } from './SplitButton';

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SplitButton из двух зон: основная кнопка действия и триггер выпадающего меню (foundation под будущий dropdownList).',
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
    text: 'Button Label',
    loading: false,
    disabled: false,
    buttonState: 'enabled',
    splitState: 'enabled',
    menuOpen: false,
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Визуальный стиль split-кнопки.',
    },
    text: {
      control: 'text',
      description: 'Текст основной кнопки.',
    },
    loading: {
      control: 'boolean',
      description: 'Состояние загрузки для обеих частей.',
    },
    disabled: {
      control: 'boolean',
      description: 'Заблокировать обе части компонента.',
    },
    buttonState: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active', 'loading', 'disabled'],
      description: 'Фиксированное состояние основной части (для демо).',
    },
    splitState: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active', 'loading', 'disabled'],
      description: 'Фиксированное состояние split-триггера (для демо).',
    },
    menuOpen: {
      control: 'boolean',
      description: 'Открытое состояние будущего dropdown.',
    },
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dropdownContent: <DropdownList />,
  },
  argTypes: {
    buttonState: {
      control: false,
      table: { disable: true },
    },
    splitState: {
      control: false,
      table: { disable: true },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Интерактивная story: hover/active работают от реального наведения и клика мышью, open-состояние доступно через menuOpen.',
      },
    },
  },
};

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <SplitButton
        appearance="primary"
        text="Button Label"
        buttonState="enabled"
        splitState="enabled"
      />
      <SplitButton
        appearance="primary"
        text="Button Label"
        buttonState="hover"
        splitState="enabled"
      />
      <SplitButton
        appearance="primary"
        text="Button Label"
        buttonState="active"
        splitState="enabled"
      />
      <SplitButton
        appearance="primary"
        text="Button Label"
        buttonState="enabled"
        splitState="hover"
      />
      <SplitButton
        appearance="primary"
        text="Button Label"
        buttonState="enabled"
        splitState="active"
      />
      <SplitButton appearance="primary" text="Button Label" loading />
      <SplitButton appearance="primary" text="Button Label" disabled />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Secondary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <SplitButton
        appearance="secondary"
        text="Button Label"
        buttonState="enabled"
        splitState="enabled"
      />
      <SplitButton
        appearance="secondary"
        text="Button Label"
        buttonState="hover"
        splitState="enabled"
      />
      <SplitButton
        appearance="secondary"
        text="Button Label"
        buttonState="active"
        splitState="enabled"
      />
      <SplitButton
        appearance="secondary"
        text="Button Label"
        buttonState="enabled"
        splitState="hover"
      />
      <SplitButton
        appearance="secondary"
        text="Button Label"
        buttonState="enabled"
        splitState="active"
      />
      <SplitButton appearance="secondary" text="Button Label" loading />
      <SplitButton appearance="secondary" text="Button Label" disabled />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
