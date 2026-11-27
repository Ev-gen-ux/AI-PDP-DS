import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, type SelectOption, type SelectProps } from './Select';

const DEMO_OPTIONS: SelectOption[] = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
  { value: 'three', label: 'Option three' },
  { value: 'disabled', label: 'Disabled item', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Одиночный выбор из списка: поле и токены `colors.select` (общие с Multiselect), список через `DropdownList` в портале под полем (как календарь `InputDate`).',
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
    options: DEMO_OPTIONS,
    placeholder: 'Select value',
    required: false,
    disabled: false,
    invalid: false,
    success: false,
    helpMessage: 'Help message',
    errorMessage: 'Error message',
  },
  argTypes: {
    label: { control: 'text', description: 'Текст метки.' },
    placeholder: { control: 'text', description: 'Подсказка в пустом поле.' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    success: { control: 'boolean' },
    helpMessage: { control: 'text' },
    errorMessage: { control: 'text' },
    options: { control: 'object', description: 'Опции списка (value, label, disabled?).' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stateful = (args: SelectProps) => {
  const [value, setValue] = useState('');
  return (
    <Select
      {...args}
      value={value}
      onValueChange={(v) => setValue(v)}
      onClear={() => setValue('')}
    />
  );
};

export const Default: Story = {
  render: (args) => <Stateful {...args} />,
};

export const States: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
      }}
    >
      <Select
        label="Default"
        options={DEMO_OPTIONS}
        placeholder="Select value"
        helpMessage="Help"
      />
      <Select
        label="With value"
        options={DEMO_OPTIONS}
        defaultValue="two"
        placeholder="Select value"
        helpMessage="Help"
      />
      <Select
        label="Invalid"
        options={DEMO_OPTIONS}
        defaultValue="one"
        invalid
        errorMessage="Error message"
      />
      <Select label="Disabled" options={DEMO_OPTIONS} placeholder="Select value" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ключевые состояния в одном контейнере (демо).',
      },
    },
  },
};
