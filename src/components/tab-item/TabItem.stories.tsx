import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { TabGroup } from '@/components/tab-group';
import type { TabItemProps } from './TabItem';
import { TabItem } from './TabItem';

type TabItemStoryArgs = TabItemProps & {
  demoGroupSelection?: string;
};

const meta = {
  title: 'Components/TabItem',
  component: TabItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Элемент вкладки: «пилюля» с типографикой и токенами `tab/item/*`. Индикатор выбора и нижняя линия группы рендерятся в `TabGroup`. Внутри `TabGroup` получает `aria-selected` и roving `tabIndex`.',
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
    value: 'demo',
    text: 'Tab label',
    selected: false,
    disabled: false,
    state: 'enabled' as const,
    demoGroupSelection: '1',
  },
  argTypes: {
    value: { control: 'text', description: 'Уникальное значение вкладки в группе.' },
    text: { control: 'text', description: 'Текст вкладки.' },
    selected: {
      control: 'inline-radio',
      options: [false, true],
      description: 'Только вне `TabGroup` (story Playground).',
    },
    disabled: { control: 'boolean' },
    state: {
      control: 'inline-radio',
      options: ['enabled', 'hover', 'active', 'focus', 'disabled'],
      description: 'Демо-состояние; в `Default` отключено.',
    },
    demoGroupSelection: {
      control: 'inline-radio',
      options: ['1', '2', '3'],
      name: 'Selected tab',
      description: 'Только для story `Default` с `TabGroup`.',
    },
  },
} satisfies Meta<TabItemStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultRender() {
    const [storyArgs, updateArgs] = useArgs();
    const sel = storyArgs.demoGroupSelection ?? '1';
    return (
      <TabGroup value={sel} onValueChange={(v) => updateArgs({ demoGroupSelection: v })}>
        <TabItem value="1" text="News" />
        <TabItem value="2" text="Video" />
        <TabItem value="3" text="Podcasts" />
      </TabGroup>
    );
  },
  argTypes: {
    demoGroupSelection: {
      control: 'inline-radio',
      options: ['1', '2', '3'],
      name: 'Selected tab',
    },
    state: { control: false, table: { disable: true } },
    selected: { table: { disable: true } },
    value: { table: { disable: true } },
    text: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
};

export const Playground: Story = {
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <TabItem {...args} />
    </div>
  ),
  argTypes: {
    demoGroupSelection: { table: { disable: true }, control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Одиночная вкладка: состояния `state` и `selected` переключаются радиокнопками в панели controls.',
      },
    },
  },
};
