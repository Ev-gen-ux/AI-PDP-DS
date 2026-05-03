import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker, type DatePickerProps } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Календарная панель по макету Figma: иконки Phosphor через `@/components/icon` (`datePickerMonthSelectIconGlyph`, prev/next month), под строкой дней недели — первая строка сетки с аббревиатурой месяца («Сен», «Окт») и пустыми ячейками до 1-го числа, если месяц не начинается с первого столбца. Токены `datePicker/*`.',
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
  argTypes: {
    year: { control: 'number', description: 'Год отображаемого месяца' },
    monthIndex: {
      control: { type: 'number', min: 0, max: 11, step: 1 },
      description: 'Месяц 0–11',
    },
    weekStartsOn: {
      control: 'select',
      options: [0, 1],
      description: '0 — с воскресенья, 1 — с понедельника',
    },
    locale: { control: 'text', description: 'Локаль для названия месяца и дней недели' },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

function DatePickerDefaultStory(args: DatePickerProps) {
  const [year, setYear] = useState(args.year);
  const [monthIndex, setMonthIndex] = useState(args.monthIndex);
  const [selected, setSelected] = useState<Date | null>(new Date(year, monthIndex, 23));
  const today = new Date(year, monthIndex, 7);

  return (
    <DatePicker
      {...args}
      year={year}
      monthIndex={monthIndex}
      selectedDate={selected}
      todayDate={today}
      onMonthPrev={() => {
        const d = new Date(year, monthIndex - 1, 1);
        setYear(d.getFullYear());
        setMonthIndex(d.getMonth());
      }}
      onMonthNext={() => {
        const d = new Date(year, monthIndex + 1, 1);
        setYear(d.getFullYear());
        setMonthIndex(d.getMonth());
      }}
      onSelectDate={(d) => setSelected(d)}
    />
  );
}

export const Default: Story = {
  render: (args) => <DatePickerDefaultStory {...args} />,
  args: {
    year: 2025,
    monthIndex: 8,
    weekStartsOn: 1,
    locale: 'ru-RU',
  },
};

export const September2025Static: Story = {
  render: () => (
    <DatePicker
      year={2025}
      monthIndex={8}
      selectedDate={new Date(2025, 8, 23)}
      todayDate={new Date(2025, 8, 7)}
      weekStartsOn={1}
      locale="ru-RU"
      onMonthPrev={() => undefined}
      onMonthNext={() => undefined}
      onSelectDate={() => {
        /* demo only */
      }}
    />
  ),
};

/** Октябрь 2025: 1-е — среда; в первой строке под неделей — «Окт» и пустая ячейка (как в Figma для месяца с ведущими днями). */
export const October2025MonthLeadRow: Story = {
  render: () => (
    <DatePicker
      year={2025}
      monthIndex={9}
      selectedDate={new Date(2025, 9, 23)}
      todayDate={new Date(2025, 9, 7)}
      weekStartsOn={1}
      locale="ru-RU"
      onMonthPrev={() => undefined}
      onMonthNext={() => undefined}
      onSelectDate={() => {
        /* demo only */
      }}
    />
  ),
};
