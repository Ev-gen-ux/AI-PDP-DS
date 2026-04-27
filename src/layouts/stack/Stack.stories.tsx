import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { Stack } from './Stack';

const DemoCard = styled.div`
  padding: ${({ theme }) => theme.spacing.paddings.default};
  border: 1px solid ${({ theme }) => theme.colors.button.outline.border.enabled};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
`;

const meta = {
  title: 'Layouts/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: { gap: 'related' },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Stack {...args}>
      <DemoCard>First</DemoCard>
      <DemoCard>Second</DemoCard>
      <DemoCard>Third</DemoCard>
    </Stack>
  ),
};
