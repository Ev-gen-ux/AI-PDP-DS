import type { Meta, StoryObj } from '@storybook/react';
import { styled } from 'styled-components';
import { Grid } from './Grid';

const Tile = styled.div`
  padding: ${({ theme }) => theme.spacing.paddings.default};
  background: ${({ theme }) => theme.colors.button.outline.background.hover};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
`;

const meta = {
  title: 'Layouts/Grid',
  component: Grid,
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      <Tile>Alpha</Tile>
      <Tile>Beta</Tile>
      <Tile>Gamma</Tile>
      <Tile>Delta</Tile>
    </Grid>
  ),
};
