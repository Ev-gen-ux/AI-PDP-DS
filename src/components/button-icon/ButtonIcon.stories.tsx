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
    size: 'large',
    loading: false,
    disabled: false,
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Визуальный вариант кнопки-иконки.',
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small'],
      description: 'Размер кнопки-иконки.',
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
    size: 'large',
    loading: false,
    disabled: false,
  },
};

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <ButtonIcon appearance="primary" size="large" />
      <ButtonIcon appearance="primary" size="medium" />
      <ButtonIcon appearance="primary" size="small" />
      <ButtonIcon appearance="primary" size="large" disabled />
      <ButtonIcon appearance="primary" size="large" loading />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Secondary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <ButtonIcon appearance="secondary" size="large" />
      <ButtonIcon appearance="secondary" size="medium" />
      <ButtonIcon appearance="secondary" size="small" />
      <ButtonIcon appearance="secondary" size="large" disabled />
      <ButtonIcon appearance="secondary" size="large" loading />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
