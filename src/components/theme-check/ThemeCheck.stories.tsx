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
import { DropdownList } from '@/components/dropdown-list';
import { Icon } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { InputText } from '@/components/input-text';
import { Label } from '@/components/label';
import { NotificationSnackbar } from '@/components/notification-snackbar';
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

        <Button appearance="primary" text="Primary" iconBefore />
        <Button appearance="outline" text="Outline" iconAfter />
        <Button appearance="flat" text="Flat" />
        <Button appearance="primary" text="Loading" loading />
        <Button appearance="outline" text="Disabled" disabled />
        <ButtonLink appearance="primary" text="Link Label" iconBefore iconAfter />
        <ButtonLink appearance="secondary" text="Link Label" iconBefore iconAfter />
        <Chips iconBefore closable />
        <Breadcrumbs />
        <ButtonIcon appearance="primary" />
        <ButtonIcon appearance="secondary" />
        <Accordion open={false} />
        <Accordion open />

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

        <Checkbox label="Checkbox" helpMessage="Help message" />
        <Checkbox label="Checkbox checked" checked />
        <Checkbox label="Checkbox error" invalid errorMessage="Error message" />
        <Radio label="Radio" helpMessage="Help message" />
        <Radio label="Radio error" invalid errorMessage="Error message" checked />
        <Radio label="Radio disabled" disabled />

        <Avatar initials="ЕВ" state="enabled" />
        <StatusMark size="Extra Small 12px" />
        <StatusLabel appearance="primary" status="success" size="medium" text="Success" />
        <StatusLabel appearance="secondary" status="information" size="medium" text="Information" />
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
      </div>
    </div>
  ),
};
