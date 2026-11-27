import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Разделитель: линия толщиной `spacing.inner.xsClosest`, варианты `calm` и `loud`, горизонтальная или вертикальная ориентация. Вертикаль: минимальная видимая высота `height.xSmall`; во flex-строке с `align-items: stretch` линия растягивается по высоте ряда.',
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
    appearance: 'calm' as const,
    orientation: 'horizontal' as const,
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['calm', 'loud'],
      description: 'Тонкая / более контрастная линия (токены `divider.background.*`).',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Направление линии.',
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) =>
    args.orientation === 'vertical' ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          height: 120,
          width: 320,
          gap: 12,
        }}
      >
        <span style={{ font: 'inherit' }}>A</span>
        <Divider {...args} />
        <span style={{ font: 'inherit' }}>B</span>
      </div>
    ) : (
      <div style={{ width: 320 }}>
        <Divider {...args} />
      </div>
    ),
};

export const CalmAndLoudHorizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Divider appearance="calm" orientation="horizontal" />
      <Divider appearance="loud" orientation="horizontal" />
    </div>
  ),
};

export const VerticalInRow: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 16,
        height: 72,
      }}
    >
      <span style={{ font: 'inherit' }}>Left</span>
      <Divider appearance="calm" orientation="vertical" />
      <span style={{ font: 'inherit' }}>Middle</span>
      <Divider appearance="loud" orientation="vertical" />
      <span style={{ font: 'inherit' }}>Right</span>
    </div>
  ),
};
