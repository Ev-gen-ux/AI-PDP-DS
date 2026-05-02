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
          'Accordion с переключаемым body-блоком. Варианты оболочки: default, calm (спокойный фон), accent (акцентная обводка). В header используется ButtonIcon.',
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
    appearance: 'default',
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
    appearance: {
      control: 'inline-radio',
      options: ['default', 'calm', 'accent'],
      description: 'Визуальный вариант оболочки (Figma).',
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

export const DefaultShell: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        maxWidth: 920,
      }}
    >
      <Accordion title="Heading" appearance="default" open={false} />
      <Accordion title="Heading" appearance="default" open />
    </div>
  ),
};

export const CalmShell: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        maxWidth: 920,
      }}
    >
      <Accordion title="Heading" appearance="calm" open={false} />
      <Accordion title="Heading" appearance="calm" open />
    </div>
  ),
};

export const AccentShell: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        maxWidth: 920,
      }}
    >
      <Accordion title="Heading" appearance="accent" open={false} />
      <Accordion title="Heading" appearance="accent" open />
    </div>
  ),
};
