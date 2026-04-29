import type { Meta, StoryObj } from '@storybook/react';
import { ButtonIcon } from './ButtonIcon';

const meta = {
  title: 'Components/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Иконка-кнопка фиксированного размера 48px с вариантами primary/secondary и состоянием loading.',
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
    loading: false,
    disabled: false,
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Визуальный вариант кнопки-иконки.',
    },
    loading: {
      control: 'boolean',
      description: 'Состояние загрузки: вместо иконки показывается Spinner.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает взаимодействие с кнопкой.',
    },
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appearance: 'primary',
    loading: false,
    disabled: false,
  },
};

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <ButtonIcon appearance="primary" />
      <ButtonIcon appearance="primary" disabled />
      <ButtonIcon appearance="primary" loading />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Secondary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <ButtonIcon appearance="secondary" />
      <ButtonIcon appearance="secondary" disabled />
      <ButtonIcon appearance="secondary" loading />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
