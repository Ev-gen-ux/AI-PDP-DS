import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Постраничная навигация: крайние переходы через `ButtonIcon` (двойные стрелки), номера страниц в стиле icon-button primary. Для `pageCount > 7` между крайними страницами показывается «…».',
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
    page: 1,
    pageCount: 3,
    onPageChange: () => undefined,
  },
  argTypes: {
    page: { control: 'number', description: 'Текущая страница (1-based).' },
    pageCount: { control: 'number', description: 'Всего страниц.' },
    disabled: { control: 'boolean', description: 'Отключает все контролы.' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stateful = (args: { pageCount: number; disabled?: boolean }) => {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      page={page}
      pageCount={args.pageCount}
      onPageChange={setPage}
      {...(args.disabled !== undefined ? { disabled: args.disabled } : {})}
    />
  );
};

export const Default: Story = {
  render: () => <Stateful pageCount={3} />,
};

export const ManyPages: Story = {
  render: () => <Stateful pageCount={24} />,
  parameters: {
    docs: {
      description: {
        story: 'Длинный список: сжатое окно вокруг текущей страницы и многоточие.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => <Stateful pageCount={5} disabled />,
  parameters: {
    docs: {
      description: {
        story: 'Все элементы недоступны.',
      },
    },
  },
};
