import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { InputPassword, type InputPasswordProps } from './InputPassword';

const meta = {
  title: 'Components/InputPassword',
  component: InputPassword,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле пароля по принятому Figma InputPassword (3628:364). Показывает и скрывает значение без очистки. success — явный результат валидации; правил длины пароля компонент не задаёт. Собственные компонентные цветовые токены inputPassword, иконки Phosphor bold через Icon.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <div style={{ width: 254, maxWidth: 'calc(100vw - 48px)' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: { label: 'Password', placeholder: 'Enter password', helpMessage: 'Enter your password' },
  argTypes: {
    label: { control: 'text', description: 'Связанная с input метка.' },
    value: { control: 'text', description: 'Контролируемое значение; используется с onChange.' },
    defaultValue: { control: 'text', description: 'Начальное неконтролируемое значение.' },
    visible: {
      control: 'boolean',
      description: 'Контролируемая видимость, вместе с onVisibleChange.',
    },
    defaultVisible: {
      control: 'boolean',
      description: 'Начальная видимость в неконтролируемом режиме.',
    },
    success: {
      control: 'boolean',
      description: 'Рамка состояния value из Figma, без проверки пароля.',
    },
    invalid: { control: 'boolean', description: 'Ошибка валидации, aria-invalid и errorMessage.' },
    disabled: { control: 'boolean', description: 'Блокирует ввод и переключение видимости.' },
    helpMessage: { control: 'text', description: 'Подсказка; пустая строка скрывает её.' },
    errorMessage: { control: 'text', description: 'При invalid заменяет подсказку.' },
    onVisibleChange: { description: 'Запрос переключения видимости; не меняет значение.' },
  },
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByLabelText('Password'));
  },
};
export const Focus: Story = {
  play: ({ canvasElement }) => {
    within(canvasElement).getByLabelText('Password').focus();
  },
};
export const WithValue: Story = { args: { defaultValue: 'Example123', success: true } };
export const Visible: Story = {
  args: { defaultValue: 'Example123', success: true, defaultVisible: true },
};
export const Invalid: Story = {
  args: { defaultValue: 'Example123', invalid: true, errorMessage: 'Check your password' },
};
export const Disabled: Story = { args: { disabled: true } };

const ControlledExample = (args: InputPasswordProps) => {
  const [value, setValue] = useState('Example123');
  const [visible, setVisible] = useState(false);
  return (
    <InputPassword
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      visible={visible}
      onVisibleChange={setVisible}
    />
  );
};
export const Controlled: Story = { render: (args) => <ControlledExample {...args} /> };

export const KeyboardAndGeometry: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Проверка в браузере: 56px, реальные клавиатура/фокус, ввод, reveal, сохранение значения. Выполняется в активной теме.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password') as HTMLInputElement;
    const field = input.parentElement as HTMLElement;
    expect(field.getBoundingClientRect().height).toBe(56);
    expect(window.getComputedStyle(field).paddingLeft).toBe('16px');
    expect(window.getComputedStyle(input).fontFamily).toContain('Inter');
    input.focus();
    await userEvent.type(input, 'Example123');
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Show password' });
    expect(button).toHaveFocus();
    expect(window.getComputedStyle(field).boxShadow).not.toBe('none');
    await userEvent.keyboard('{Enter}');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('Example123');
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(field.getBoundingClientRect().height).toBe(56);
    await userEvent.keyboard(' ');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveValue('Example123');
  },
};
