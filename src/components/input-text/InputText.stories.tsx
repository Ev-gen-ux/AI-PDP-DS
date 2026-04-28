import type { Meta, StoryObj } from '@storybook/react';
import { InputText } from './InputText';
import { Stack } from '@/layouts/stack';

const meta = {
  title: 'Components/InputText',
  component: InputText,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    defaultValue: '',
    required: false,
    disabled: false,
    readOnly: false,
    invalid: false,
    success: false,
    helpMessage: 'Help message',
    errorMessage: 'Error message',
  },
  argTypes: {
    invalid: { control: 'boolean' },
    success: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Hover: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};

export const Focus: Story = {
  args: {
    label: 'Focus',
    defaultValue: 'Placeholder',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Placeholder',
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: 'Placeholder',
    errorMessage: 'Error message',
  },
};

export const Success: Story = {
  args: {
    success: true,
    defaultValue: 'Placeholder',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Placeholder',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="grouped">
      <InputText label="Enabled" placeholder="Placeholder" helpMessage="Help message" />
      <InputText label="Value" defaultValue="Placeholder" helpMessage="Help message" />
      <InputText label="Focus" defaultValue="Placeholder" helpMessage="Help message" />
      <InputText label="Invalid" defaultValue="Placeholder" invalid errorMessage="Error message" />
      <InputText label="Success" defaultValue="Placeholder" success helpMessage="Help message" />
      <InputText label="ReadOnly" defaultValue="Placeholder" readOnly helpMessage="Help message" />
      <InputText label="Disabled" placeholder="Placeholder" disabled />
    </Stack>
  ),
};
