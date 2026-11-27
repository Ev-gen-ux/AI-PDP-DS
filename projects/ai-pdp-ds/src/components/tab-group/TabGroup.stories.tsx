import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { TabItem } from '@/components/tab-item';
import { TabGroup } from './TabGroup';

const defaultTabs = (
  <>
    <TabItem value="news" text="News" />
    <TabItem value="video" text="Video" />
    <TabItem value="podcasts" text="Podcasts" />
  </>
);

const meta = {
  title: 'Components/TabGroup',
  component: TabGroup,
  tags: ['autodocs'],
  args: {
    value: 'news',
    children: defaultTabs,
  },
  argTypes: {
    value: {
      control: 'inline-radio',
      options: ['news', 'video', 'podcasts'],
      description: 'Выбранная вкладка (controlled).',
    },
    children: { table: { disable: true }, control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Горизонтальный tablist: нижняя граница группы и синий индикатор выбранной вкладки. Управляет значением и клавиатурной навигацией дочерних `TabItem`.',
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
} satisfies Meta<typeof TabGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'news',
    children: defaultTabs,
  },
  render: function DefaultRender(args) {
    const [, updateArgs] = useArgs();
    const value = args.value ?? 'news';
    return (
      <TabGroup value={value} onValueChange={(v) => updateArgs({ value: v })}>
        {args.children}
      </TabGroup>
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'a',
    children: (
      <>
        <TabItem value="a" text="Tab A" />
        <TabItem value="b" text="Tab B" />
        <TabItem value="c" text="Tab C" />
      </>
    ),
  },
  argTypes: {
    value: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <TabGroup defaultValue={args.defaultValue ?? 'a'} onValueChange={() => {}}>
      {args.children}
    </TabGroup>
  ),
};

const disabledTabs = (
  <>
    <TabItem value="one" text="Enabled" />
    <TabItem value="two" text="Disabled" disabled />
    <TabItem value="three" text="Other" />
  </>
);

export const WithDisabledTab: Story = {
  args: {
    value: 'one',
    children: disabledTabs,
  },
  argTypes: {
    value: {
      control: 'inline-radio',
      options: ['one', 'two', 'three'],
    },
  },
  render: function WithDisabledRender(args) {
    const [, updateArgs] = useArgs();
    const value = args.value ?? 'one';
    return (
      <TabGroup value={value} onValueChange={(v) => updateArgs({ value: v })}>
        {args.children}
      </TabGroup>
    );
  },
};
