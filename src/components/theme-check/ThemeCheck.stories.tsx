import type { Meta, StoryObj } from '@storybook/react';
import { CodeIcon } from '@phosphor-icons/react';
import { Avatar } from '@/components/avatar';
import { Accordion } from '@/components/accordion';
import { BenefitCard } from '@/components/benefit-card';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/button';
import { ButtonIcon } from '@/components/button-icon';
import { ButtonLink } from '@/components/button-link';
import { Checkbox } from '@/components/checkbox';
import { Chips } from '@/components/chips';
import { Counter } from '@/components/counter';
import { DatePicker, MonthPicker, YearPicker } from '@/components/date-picker';
import { Divider } from '@/components/divider';
import { DropdownList } from '@/components/dropdown-list';
import { Icon } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { InputDate } from '@/components/input-date';
import { InputEmail } from '@/components/input-email';
import { InputFile } from '@/components/input-file';
import { InputSearch } from '@/components/input-search';
import { InputText } from '@/components/input-text';
import { Label } from '@/components/label';
import { Modal, ModalFooterActions } from '@/components/modal';
import { NotificationSnackbar } from '@/components/notification-snackbar';
import { Pagination } from '@/components/pagination';
import { Radio } from '@/components/radio';
import { Spinner } from '@/components/spinner';
import { SplitButton } from '@/components/split-button';
import { SidebarNavigationItem } from '@/components/sidebar-navigation-item';
import { Sidebar } from '@/components/sidebar';
import { SelectButton } from '@/components/select-button';
import { StatusLabel } from '@/components/status-label';
import { StatusMark } from '@/components/status-mark';
import { TableColumn, TableRow } from '@/components/table';
import { TableCellEmptyState, TableCellTextContent } from '@/components/table-cell';
import { TabGroup } from '@/components/tab-group';
import { TabItem } from '@/components/tab-item';
import { ToggleButton } from '@/components/toggle-button';

const meta = {
  title: 'Foundation/ThemeCheck',
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          width: 'fit-content',
        }}
      >
        <Label text="Theme Check" />
        <InlineMessage message="Switch theme from the toolbar: Light / Dark" />
        <InlineMessage status="error" message="Inline error message" />
        <InlineMessage status="success" message="Inline success message" />

        <Button appearance="primary" text="Primary" iconBefore />
        <Button appearance="outline" text="Outline" iconAfter />
        <Button appearance="flat" text="Flat" />
        <Button appearance="primary" text="Loading" loading />
        <Button appearance="outline" text="Disabled" disabled />
        <ButtonLink appearance="primary" text="Link Label" iconBefore iconAfter />
        <ButtonLink appearance="secondary" text="Link Label" iconBefore iconAfter />
        <Chips iconBefore closable />
        <Counter value={3} appearance="primary" size="extra small (16px)" />
        <Counter value={150} appearance="primary" size="small (24px)" />
        <Counter value={1200} appearance="secondary" size="small (24px)" />
        <div style={{ width: 280 }}>
          <Divider appearance="calm" orientation="horizontal" />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            height: 48,
            gap: 12,
          }}
        >
          <span style={{ font: 'inherit' }}>A</span>
          <Divider appearance="loud" orientation="vertical" />
          <span style={{ font: 'inherit' }}>B</span>
        </div>
        <Breadcrumbs />
        <ButtonIcon appearance="primary" />
        <ButtonIcon appearance="secondary" />
        <Pagination page={2} pageCount={5} onPageChange={() => undefined} />
        <Pagination page={5} pageCount={24} onPageChange={() => undefined} />
        <Pagination page={1} pageCount={3} disabled onPageChange={() => undefined} />
        <Accordion open={false} appearance="default" />
        <Accordion open appearance="default" />
        <Accordion open={false} appearance="calm" />
        <Accordion open appearance="calm" />
        <Accordion open={false} appearance="accent" />
        <Accordion open appearance="accent" />

        <div style={{ width: '320px' }}>
          <InputDate label="Date default" helpMessage="Help message" />
        </div>
        <div style={{ width: '320px' }}>
          <InputDate label="Date with value" defaultValue="2024-06-15" helpMessage="Help message" />
        </div>
        <div style={{ width: '320px' }}>
          <InputDate
            label="Date invalid"
            defaultValue="2024-06-15"
            invalid
            errorMessage="Error message"
          />
        </div>
        <div style={{ width: '320px' }}>
          <InputDate label="Date disabled" disabled />
        </div>
        <DatePicker
          year={2025}
          monthIndex={8}
          selectedDate={new Date(2025, 8, 23)}
          todayDate={new Date(2025, 8, 7)}
          weekStartsOn={1}
          locale="ru-RU"
          onMonthPrev={() => undefined}
          onMonthNext={() => undefined}
          onSelectDate={() => undefined}
        />
        <YearPicker
          rangeLabel="2001–2023"
          leadYear={2023}
          years={Array.from({ length: 12 }, (_, i) => 2012 + i)}
          selectedYear={2023}
          onPrevPage={() => undefined}
          onNextPage={() => undefined}
          onSelectYear={() => undefined}
        />
        <MonthPicker
          year={2023}
          rangeLabel="2001–2023"
          selectedMonthIndex={5}
          locale="ru-RU"
          onPrevYear={() => undefined}
          onNextYear={() => undefined}
          onSelectMonth={() => undefined}
        />
        <div style={{ width: '320px' }}>
          <InputText label="Default" placeholder="Placeholder" helpMessage="Help message" />
        </div>
        <div style={{ width: '320px' }}>
          <InputText label="With value" defaultValue="Value" helpMessage="Help message" />
        </div>
        <div style={{ width: '320px' }}>
          <InputText
            label="Invalid"
            defaultValue="Wrong value"
            invalid
            errorMessage="Error message"
          />
        </div>
        <div style={{ width: '320px' }}>
          <InputText label="ReadOnly" defaultValue="Read-only value" readOnly />
        </div>
        <div style={{ width: '320px' }}>
          <InputText label="Disabled" placeholder="Placeholder" disabled />
        </div>
        <div style={{ width: '320px' }}>
          <InputSearch
            label="Search default"
            placeholder="Placeholder"
            helpMessage="Help message"
          />
        </div>
        <div style={{ width: '320px' }}>
          <InputSearch
            label="Search invalid"
            defaultValue="x"
            invalid
            errorMessage="Error message"
          />
        </div>
        <div style={{ width: '320px' }}>
          <InputSearch label="Search disabled" placeholder="Placeholder" disabled />
        </div>
        <div style={{ width: '320px' }}>
          <InputEmail label="Email default" helpMessage="Help message" />
        </div>
        <div style={{ width: '320px' }}>
          <InputEmail label="Email invalid" defaultValue="x" invalid errorMessage="Error message" />
        </div>
        <div style={{ width: '320px' }}>
          <InputEmail label="Email disabled" placeholder="email@example.com" disabled />
        </div>
        <div style={{ width: '320px' }}>
          <InputFile label="File default" helpMessage="Help message" />
        </div>
        <div style={{ width: '320px' }}>
          <InputFile
            label="File with items"
            helpMessage="Help message"
            items={[
              { id: 't1', fileName: 'doc.pdf', fileSizeLabel: '12 (KB)', status: 'success' },
              { id: 't2', fileName: 'data.zip', fileSizeLabel: '2 (MB)', status: 'uploading' },
            ]}
            onRemoveItem={() => undefined}
          />
        </div>
        <div style={{ width: '320px' }}>
          <InputFile
            label="File invalid"
            invalid
            errorMessage="Error message"
            items={[
              {
                id: 't3',
                fileName: 'bad.bin',
                fileSizeLabel: '1 (KB)',
                status: 'error',
                errorMessage: 'Upload failed',
              },
            ]}
            onRemoveItem={() => undefined}
          />
        </div>

        <Checkbox label="Checkbox" helpMessage="Help message" />
        <Checkbox label="Checkbox checked" checked />
        <Checkbox label="Checkbox error" invalid errorMessage="Error message" />
        <Radio label="Radio" helpMessage="Help message" />
        <Radio label="Radio error" invalid errorMessage="Error message" checked />
        <Radio label="Radio disabled" disabled />

        <Avatar initials="ЕВ" state="enabled" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <StatusMark appearance="success" size="Extra Small 12px" />
          <StatusMark appearance="error" size="Extra Small 12px" />
          <StatusMark appearance="alert" size="Extra Small 12px" />
          <StatusMark appearance="information" size="Extra Small 12px" />
          <StatusMark appearance="wait" size="Extra Small 12px" />
        </div>
        <StatusLabel appearance="primary" status="success" size="medium" text="Success" />
        <StatusLabel appearance="secondary" status="information" size="medium" text="Information" />
        <TabGroup defaultValue="first">
          <TabItem value="first" text="Tab one" />
          <TabItem value="second" text="Tab two" />
          <TabItem value="third" text="Disabled" disabled />
        </TabGroup>
        <ToggleButton appearance="primary" selected={false} text="Toggle Button" />
        <ToggleButton appearance="primary" selected text="Toggle Button" />
        <ToggleButton appearance="secondary" selected={false} />
        <ToggleButton appearance="secondary" selected />
        <SplitButton appearance="primary" text="Button Label" />
        <SplitButton appearance="secondary" text="Button Label" />
        <SelectButton />
        <DropdownList />
        <NotificationSnackbar
          appearance="success"
          title="Label"
          description="Description"
          closable={false}
        />

        <Modal
          header="Modal"
          moveFocusOnMount={false}
          footer={
            <ModalFooterActions>
              <Button appearance="primary" size="small" text="Primary" />
              <Button appearance="outline" size="small" text="Outline" />
            </ModalFooterActions>
          }
        >
          <div style={{ minHeight: 80 }}>Modal body</div>
        </Modal>
        <Modal header="No leading icon" iconBefore={false} moveFocusOnMount={false}>
          <div style={{ minHeight: 48 }}>Content</div>
        </Modal>

        <BenefitCard appearance="primary" />
        <BenefitCard appearance="secondary" />
        <SidebarNavigationItem state="enabled" />
        <SidebarNavigationItem state="active" />
        <Sidebar state="default" />
        <Sidebar state="collapse" />
        <TableCellEmptyState />
        <TableCellTextContent />

        <div style={{ overflowX: 'auto' }}>
          <TableRow />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <TableColumn />
        </div>

        <Icon icon={CodeIcon} size={16} />
        <Icon icon={CodeIcon} size={24} />
        <Spinner size={16} />
        <Spinner size={24} />
        <Spinner size={32} />
        <Spinner size={40} />
      </div>
    </div>
  ),
};
