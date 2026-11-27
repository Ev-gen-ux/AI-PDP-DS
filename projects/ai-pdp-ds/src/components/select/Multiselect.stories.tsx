import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Multiselect, type MultiselectOption, type MultiselectProps } from './Multiselect';

const DEMO_OPTIONS: MultiselectOption[] = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
  { value: 'three', label: 'Option three' },
  { value: 'disabled', label: 'Disabled item', disabled: true },
];

const meta = {
  title: 'Components/Multiselect',
  component: Multiselect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Множественный выбор: те же токены `colors.select`, что у `Select`; выбранные значения — `Chips` (extra small, closable). Список опций — портал под полем (как `InputDate`).',
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
    placeholder: 'Multiselect',
    required: false,
    disabled: false,
    invalid: false,
    success: false,
    helpMessage: 'Help message',
    errorMessage: 'Error message',
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    success: { control: 'boolean' },
    helpMessage: { control: 'text' },
    errorMessage: { control: 'text' },
    options: { control: 'object' },
  },
} satisfies Meta<typeof Multiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stateful = (args: MultiselectProps) => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Multiselect {...args} value={value} onValueChange={setValue} onClear={() => setValue([])} />
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
      <Multiselect
        label="Default"
        options={DEMO_OPTIONS}
        placeholder="Multiselect"
        helpMessage="Help"
      />
      <Multiselect
        label="With selection"
        options={DEMO_OPTIONS}
        defaultValue={['one', 'two']}
        placeholder="Multiselect"
        helpMessage="Help"
      />
      <Multiselect
        label="Invalid"
        options={DEMO_OPTIONS}
        defaultValue={['three']}
        invalid
        errorMessage="Error message"
      />
      <Multiselect label="Disabled" options={DEMO_OPTIONS} placeholder="Multiselect" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ключевые состояния (демо).',
      },
    },
  },
};
