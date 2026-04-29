import type { Meta, StoryObj } from '@storybook/react';
import { Code } from '@phosphor-icons/react';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { InlineMessage } from '@/components/inline-message';
import { InputText } from '@/components/input-text';
import { Label } from '@/components/label';
import { Spinner } from '@/components/spinner';
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
          </Stack>
        </div>
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
