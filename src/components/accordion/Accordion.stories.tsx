import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import type { ComponentProps } from 'react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accordion с переключаемым body-блоком. В header используется ButtonIcon, в открытом состоянии — caret-up и active background.',
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
    title: 'Heading',
    open: false,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Текст заголовка.',
    },
    open: {
      control: 'boolean',
      description: 'Состояние раскрытия.',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

function RenderDefault(args: ComponentProps<typeof Accordion>) {
  const [{ open }, updateArgs] = useArgs<typeof args>();

  return (
    <Accordion
      {...args}
      open={Boolean(open)}
      onOpenChange={(nextOpen) => updateArgs({ open: nextOpen })}
    />
  );
}

export const Default: Story = {
  render: RenderDefault,
};

export const Closed: Story = {
  args: {
    title: 'Heading',
    open: false,
  },
};

export const Open: Story = {
  args: {
    title: 'Heading',
    open: true,
  },
};
