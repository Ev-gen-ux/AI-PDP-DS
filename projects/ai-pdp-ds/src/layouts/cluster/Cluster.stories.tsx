import type { Meta, StoryObj } from '@storybook/react';
import { styled } from 'styled-components';
import { Cluster } from './Cluster';

const Chip = styled.span`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing.inner.close};
  border-radius: ${({ theme }) => theme.borderRadius.rounded};
  background: ${({ theme }) => theme.colors.button.outline.background.hover};
  color: ${({ theme }) => theme.colors.button.outline.label.enabled};
`;

const meta = {
  title: 'Layouts/Cluster',
  component: Cluster,
  tags: ['autodocs'],
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Cluster {...args}>
      <Chip>React</Chip>
      <Chip>TypeScript</Chip>
      <Chip>Storybook</Chip>
      <Chip>Styled Components</Chip>
    </Cluster>
  ),
};
