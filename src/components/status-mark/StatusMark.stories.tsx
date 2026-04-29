import type { Meta, StoryObj } from '@storybook/react';
import { StatusMark } from './StatusMark';

const meta = {
  title: 'Components/StatusMark',
  component: StatusMark,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Компактный маркер статуса (online) для аватара и других компактных индикаторов присутствия.',
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
    size: 'Extra Extra Small 8px',
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['success'],
      description: 'Вариант маркера статуса.',
    },
    size: {
      control: 'inline-radio',
      options: ['Extra Extra Small 8px', 'Extra Small 12px', 'Small 16px'],
      description: 'Размер маркера из мастер-компонента Figma.',
    },
  },
} satisfies Meta<typeof StatusMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Size8: Story = {
  args: {
    size: 'Extra Extra Small 8px',
  },
};

export const Size12: Story = {
  args: {
    size: 'Extra Small 12px',
  },
};

export const Size16: Story = {
  args: {
    size: 'Small 16px',
  },
};
