import type { Meta, StoryObj } from '@storybook/react';
import { BenefitCard } from './BenefitCard';

const meta = {
  title: 'Components/BenefitCard',
  component: BenefitCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'BenefitCard для информационных блоков с настраиваемыми слотами (до/после), статус-лейблом, текстовой зоной и CTA-кнопками.',
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
    appearance: 'primary',
    heading: 'Benefit Heading',
    description: 'Description',
    statusLabelText: 'Status Label',
    contentBefore: true,
    contentAfter: true,
    hasIcon: true,
    hasLabel: true,
    hasButtonPrimary: true,
    hasButtonOutline: true,
    childrenBody: true,
    primaryButtonText: 'Button Label',
    outlineButtonText: 'Button Label',
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      description: 'Визуальный стиль карточки.',
    },
    heading: {
      control: 'text',
      description: 'Текст заголовка карточки.',
    },
    description: {
      control: 'text',
      description: 'Текст описания.',
    },
    childrenBody: {
      control: 'boolean',
      description: 'Показывать body-slot между текстом и кнопками.',
    },
  },
} satisfies Meta<typeof BenefitCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <BenefitCard appearance="primary" />
      <BenefitCard appearance="primary" hasLabel={false} />
      <BenefitCard appearance="primary" hasButtonOutline={false} />
      <BenefitCard appearance="primary" hasButtonPrimary={false} />
      <BenefitCard appearance="primary" childrenBody={false} />
      <BenefitCard appearance="primary" contentBefore={false} contentAfter={false} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Secondary: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <BenefitCard appearance="secondary" />
      <BenefitCard appearance="secondary" hasLabel={false} />
      <BenefitCard appearance="secondary" hasButtonOutline={false} />
      <BenefitCard appearance="secondary" hasButtonPrimary={false} />
      <BenefitCard appearance="secondary" childrenBody={false} />
      <BenefitCard appearance="secondary" contentBefore={false} contentAfter={false} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
