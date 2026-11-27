import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/button';
import { Stepper } from './Stepper';

const sampleItems = [
  {
    state: 'completed' as const,
    heading: 'Heading',
    paragraph: true,
    description: 'Description',
    body: false,
    footer: false,
  },
  {
    state: 'active' as const,
    heading: 'Heading',
    paragraph: true,
    description: 'Description',
    body: false,
    footer: true,
    footerContent: (
      <>
        <Button appearance="flat" size="small" text="Prev" type="button" />
        <Button appearance="outline" size="small" text="Next" type="button" />
      </>
    ),
  },
  {
    state: 'disabled' as const,
    heading: 'Heading',
    paragraph: true,
    description: 'Description',
    body: false,
    footer: false,
  },
];

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Пошаговый индикатор ([мастер Figma · stepper](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-30346)): на корне `orientation`; у шага `state` (`completed` | `active` | `disabled` | `invalid`), `invalid` (`true` | `false`), `body` / `footer` — видимость слотов (по умолчанию `true` в макете), `heading`, `paragraph`, `description`, `children`, `footerContent` (в макете: `Button` **flat** «Prev» + **outline** «Next», `size="small"` — 32px).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px', width: 'min(100%, 720px)' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    orientation: 'horizontal',
    items: sampleItems,
    'aria-label': 'Checkout steps',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Направление списка шагов (`horizontal` | `vertical`).',
    },
    items: {
      control: 'object',
      description:
        'Шаги: `state`, `invalid?`, `heading`, `paragraph?`, `description?`, `body?`, `children?`, `footer?`, `footerContent?`, …',
    },
    'aria-label': { control: 'text', description: 'Подпись для `nav` (a11y).' },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HorizontalStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Stepper
        orientation="horizontal"
        aria-label="All states"
        items={[
          {
            state: 'completed',
            heading: 'Heading',
            paragraph: true,
            description: 'Description',
            invalid: false,
            body: false,
            footer: false,
          },
          {
            state: 'active',
            heading: 'Heading',
            paragraph: true,
            description: 'Description',
            invalid: false,
            body: false,
            footer: false,
          },
          {
            state: 'invalid',
            invalid: true,
            heading: 'Heading',
            paragraph: true,
            description: 'Description',
            body: false,
            footer: false,
          },
          {
            state: 'disabled',
            heading: 'Heading',
            paragraph: true,
            description: 'Description',
            invalid: false,
            body: false,
            footer: false,
          },
        ]}
      />
    </div>
  ),
};

export const SlotsToggles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`paragraph: false` скрывает описание; `body: false` / `footer: false` скрывают слоты (в макете по умолчанию включены).',
      },
    },
  },
  render: () => (
    <Stepper
      aria-label="Slot toggles"
      items={[
        {
          state: 'active',
          heading: 'Без абзаца',
          paragraph: false,
          body: true,
          children: <div style={{ padding: 8 }}>Body</div>,
          footer: true,
          footerContent: (
            <>
              <Button appearance="flat" size="small" text="Prev" type="button" />
              <Button appearance="outline" size="small" text="Next" type="button" />
            </>
          ),
        },
      ]}
    />
  ),
};

export const VerticalFlow: Story = {
  args: {
    orientation: 'vertical',
    items: sampleItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Вертикальный стек: маркер и линия слева, текст и действия справа.',
      },
    },
  },
};
