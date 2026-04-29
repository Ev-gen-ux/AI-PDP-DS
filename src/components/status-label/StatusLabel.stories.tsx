import type { Meta, StoryObj } from '@storybook/react';
import { StatusLabel } from './StatusLabel';

const meta = {
  title: 'Components/StatusLabel',
  component: StatusLabel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Компактный статусный индикатор с вариантами оформления primary/secondary и набором системных статусов.',
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
    text: 'Status label',
    status: 'success',
    appearance: 'primary',
    size: 'medium',
    withIcon: true,
  },
  argTypes: {
    text: { control: 'text', description: 'Текст индикатора статуса.' },
    status: {
      control: 'inline-radio',
      options: ['success', 'information', 'alert', 'wait', 'error'],
      description: 'Тип статуса.',
    },
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Визуальный стиль компонента.',
    },
    size: {
      control: 'inline-radio',
      options: ['medium', 'small'],
      description: 'Размер компонента: medium (32px) или small (24px).',
    },
    withIcon: {
      control: 'boolean',
      description: 'Показывать иконку статуса слева.',
    },
  },
} satisfies Meta<typeof StatusLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <StatusLabel appearance="primary" size="medium" status="success" text="Success" />
      <StatusLabel appearance="primary" size="medium" status="information" text="Information" />
      <StatusLabel appearance="primary" size="medium" status="alert" text="Alert" />
      <StatusLabel appearance="primary" size="medium" status="wait" text="Wait" />
      <StatusLabel appearance="primary" size="medium" status="error" text="Error" />
    </div>
  ),
};

export const Secondary: Story = {
  render: () => (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <StatusLabel appearance="secondary" size="medium" status="success" text="Success" />
        <StatusLabel appearance="secondary" size="medium" status="information" text="Information" />
        <StatusLabel appearance="secondary" size="medium" status="alert" text="Alert" />
        <StatusLabel appearance="secondary" size="medium" status="wait" text="Wait" />
        <StatusLabel appearance="secondary" size="medium" status="error" text="Error" />
      </div>
    </>
  ),
};
