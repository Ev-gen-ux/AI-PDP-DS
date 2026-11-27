import type { Meta, StoryObj } from '@storybook/react';
import { Catalog } from './Catalog';

const meta = {
  title: 'Foundation/Token Reference',
  component: Catalog,
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Каталог существующих токенов AI-PDP-DS, построенный по исходникам и их использованию в реализации.',
      },
    },
  },
  args: { page: 'reference' },
} satisfies Meta<typeof Catalog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
