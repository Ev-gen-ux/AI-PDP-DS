import type { Meta, StoryObj } from '@storybook/react';
import { NotificationSnackbar } from './NotificationSnackbar';

const meta = {
  title: 'Components/NotificationSnackbar',
  component: NotificationSnackbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Snackbar-уведомление с четырьмя appearance-вариантами, статусной иконкой 24px (fill) и кнопкой закрытия.',
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
    appearance: 'success',
    title: 'Label',
    description: 'Description',
    closable: true,
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['success', 'information', 'alert', 'error'],
      description: 'Визуальный appearance уведомления и соответствующие токены цветов.',
    },
    title: {
      control: 'text',
      description: 'Заголовок уведомления.',
    },
    description: {
      control: 'text',
      description: 'Описание уведомления.',
    },
    closable: {
      control: 'boolean',
      description: 'Показывает кнопку закрытия.',
    },
    onClose: {
      action: 'close-click',
      description: 'Коллбек клика по кнопке закрытия.',
    },
  },
} satisfies Meta<typeof NotificationSnackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <NotificationSnackbar appearance="success" title="Label" description="Description" />
      <NotificationSnackbar appearance="information" title="Label" description="Description" />
      <NotificationSnackbar appearance="alert" title="Label" description="Description" />
      <NotificationSnackbar appearance="error" title="Label" description="Description" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
