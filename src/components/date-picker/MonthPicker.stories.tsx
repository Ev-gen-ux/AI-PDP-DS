import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MonthPicker, type MonthPickerProps } from './MonthPicker';

const meta: Meta<typeof MonthPicker> = {
  title: 'Components/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Выбор месяца: панель по макету Figma (`monthPicker`), сетка 4×3, подписи месяцев через `formatMonthAbbrev`, токены `datePicker/*`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MonthPicker>;

function MonthPickerDefaultStory(args: MonthPickerProps) {
  const [year, setYear] = useState(args.year);
  const [selected, setSelected] = useState<number | null>(5);

  return (
    <MonthPicker
      {...args}
      year={year}
      rangeLabel="2001–2023"
      selectedMonthIndex={selected}
      locale="ru-RU"
      onPrevYear={() => setYear((y) => y - 1)}
      onNextYear={() => setYear((y) => y + 1)}
      onSelectMonth={(m) => setSelected(m)}
      onRangeClick={() => undefined}
    />
  );
}

export const Default: Story = {
  render: (args) => <MonthPickerDefaultStory {...args} />,
  args: {
    year: 2023,
  },
};

export const FigmaParity: Story = {
  name: 'Figma (Июн выбран)',
  render: () => (
    <MonthPicker
      year={2023}
      rangeLabel="2001–2023"
      selectedMonthIndex={5}
      locale="ru-RU"
      onPrevYear={() => undefined}
      onNextYear={() => undefined}
      onSelectMonth={() => undefined}
    />
  ),
};
