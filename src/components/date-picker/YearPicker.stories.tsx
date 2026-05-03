import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { YearPicker, type YearPickerProps } from './YearPicker';

const meta: Meta<typeof YearPicker> = {
  title: 'Components/YearPicker',
  component: YearPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Выбор года: панель по макету Figma (`yearPicker`), сетка 4×3, токены `datePicker/*`, навигация и иконки как у `DatePicker`.',
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
type Story = StoryObj<typeof YearPicker>;

const figmaYears = Array.from({ length: 12 }, (_, i) => 2012 + i);

function YearPickerDefaultStory(args: YearPickerProps) {
  const [pageStart, setPageStart] = useState(2012);
  const [selected, setSelected] = useState<number | null>(2023);
  const years = Array.from({ length: 12 }, (_, i) => pageStart + i);
  const leadYear = pageStart + 11;

  return (
    <YearPicker
      {...args}
      rangeLabel="2001–2023"
      leadYear={leadYear}
      years={years}
      selectedYear={selected}
      onPrevPage={() => setPageStart((y) => y - 12)}
      onNextPage={() => setPageStart((y) => y + 12)}
      prevPageDisabled={pageStart <= 2001}
      nextPageDisabled={pageStart + 11 >= 2023}
      onSelectYear={(y) => setSelected(y)}
      onRangeClick={() => undefined}
    />
  );
}

export const Default: Story = {
  render: (args) => <YearPickerDefaultStory {...args} />,
  args: {},
};

export const FigmaParity: Story = {
  name: 'Figma (2012–2023)',
  render: () => (
    <YearPicker
      rangeLabel="2001–2023"
      leadYear={2023}
      years={figmaYears}
      selectedYear={2023}
      onPrevPage={() => undefined}
      onNextPage={() => undefined}
      onSelectYear={() => undefined}
    />
  ),
};
