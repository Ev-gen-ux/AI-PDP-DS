import type { Meta, StoryObj } from '@storybook/react';
import { Code } from '@phosphor-icons/react';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { ButtonIcon } from '@/components/button-icon';
import { ButtonLink } from '@/components/button-link';
import { Checkbox } from '@/components/checkbox';
import { Icon } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { InputText } from '@/components/input-text';
import { Label } from '@/components/label';
import { Radio } from '@/components/radio';
import { Spinner } from '@/components/spinner';
import { StatusLabel } from '@/components/status-label';
import { StatusMark } from '@/components/status-mark';
import { ToggleButton } from '@/components/toggle-button';
import { Cluster } from '@/layouts/cluster';
import { Stack } from '@/layouts/stack';

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
    <Stack gap="grouped">
      <div style={{ padding: '24px' }}>
        <Stack gap="close">
          <Label text="Theme Check" />
          <InlineMessage message="Switch theme from the toolbar: Light / Dark" />
        </Stack>
      </div>

      <div style={{ padding: '24px' }}>
        <Cluster gap="related">
          <Button appearance="primary" text="Primary" iconBefore />
          <Button appearance="outline" text="Outline" iconAfter />
          <Button appearance="flat" text="Flat" />
          <Button appearance="primary" text="Loading" loading />
          <Button appearance="outline" text="Disabled" disabled />
          <ButtonLink appearance="primary" text="Link Label" iconBefore iconAfter />
          <ButtonLink appearance="secondary" text="Link Label" iconBefore iconAfter />
          <ButtonIcon appearance="primary" />
          <ButtonIcon appearance="secondary" />
        </Cluster>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ width: '320px' }}>
          <Stack gap="related">
            <InputText label="Default" placeholder="Placeholder" helpMessage="Help message" />
            <InputText label="With value" defaultValue="Value" helpMessage="Help message" />
            <InputText
              label="Invalid"
              defaultValue="Wrong value"
              invalid
              errorMessage="Error message"
            />
            <InputText label="ReadOnly" defaultValue="Read-only value" readOnly />
            <InputText label="Disabled" placeholder="Placeholder" disabled />
            <Checkbox label="Checkbox" helpMessage="Help message" />
            <Checkbox label="Checkbox checked" checked />
            <Checkbox label="Checkbox error" invalid errorMessage="Error message" />
            <Radio label="Radio" helpMessage="Help message" />
            <Radio label="Radio error" invalid errorMessage="Error message" checked />
            <Radio label="Radio disabled" disabled />
          </Stack>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Cluster gap="related">
          <Avatar initials="ЕВ" state="enabled" />
          <StatusMark size="Extra Small 12px" />
          <StatusLabel appearance="primary" status="success" size="medium" text="Success" />
          <StatusLabel
            appearance="secondary"
            status="information"
            size="medium"
            text="Information"
          />
          <ToggleButton appearance="primary" selected={false} text="Toggle Button" />
          <ToggleButton appearance="primary" selected text="Toggle Button" />
          <ToggleButton appearance="secondary" selected={false} />
          <ToggleButton appearance="secondary" selected />
        </Cluster>
      </div>

      <div style={{ padding: '24px' }}>
        <Cluster gap="related">
          <Icon icon={Code} size={16} />
          <Icon icon={Code} size={24} />
          <Spinner size={16} />
          <Spinner size={24} />
        </Cluster>
      </div>
    </Stack>
  ),
};
