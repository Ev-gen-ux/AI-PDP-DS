import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/button';
import { StepperGroup } from './StepperGroup';

const groupSteps = [
  {
    state: 'completed' as const,
    heading: 'Heading',
    paragraph: true,
    description: 'Description',
  },
  {
    state: 'active' as const,
    heading: 'Heading',
    paragraph: true,
    description: 'Description',
  },
  {
    state: 'disabled' as const,
    heading: 'Heading',
    paragraph: true,
    description: 'Description',
  },
];

const footer = (
  <>
    <Button appearance="flat" size="small" text="Prev" type="button" />
    <Button appearance="outline" size="small" text="Next" type="button" />
  </>
);

const meta = {
  title: 'Components/StepperGroup',
  component: StepperGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Группа шагов с общим слотом контента и подвалом: [stepperGroupHorizontal · 3415:31861](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-31861), [stepperGroupVertical · 3415:32072](https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3415-32072). У `vertical` слот и `footerContent` вложены после шага `nestedContentStepIndex` (по умолчанию `0`).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px', width: 'min(100%, 520px)' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    orientation: 'horizontal',
    steps: groupSteps,
    nestedContentStepIndex: 0,
    children: null,
    footerContent: footer,
    'aria-label': 'Wizard steps',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: '`horizontal` | `vertical` — соответствует мастерам Figma.',
    },
    nestedContentStepIndex: {
      control: 'number',
      description: 'Индекс шага (0-based), после которого показывать слоты; только для `vertical`.',
    },
    steps: {
      control: 'object',
      description:
        'Шаги: `state`, `invalid?`, `heading`, `paragraph?`, `description?`, `markerIndex?`.',
    },
    'aria-label': { control: 'text', description: 'Подпись для `nav`.' },
  },
} satisfies Meta<typeof StepperGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <span style={{ padding: 8, display: 'block' }}>Content slot</span>,
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    children: <span style={{ padding: 8, display: 'block' }}>Content slot</span>,
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    nestedContentStepIndex: 0,
    children: <span style={{ padding: 8, display: 'block' }}>Content slot</span>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Слот контента и кнопки под первым шагом, как в мастере `stepperGroupVertical`.',
      },
    },
  },
};
