import type { Meta, StoryObj } from '@storybook/react';
import SwapCard from './SwapCard';

const meta = {
  title: 'Organisms/SwapCard',
  component: SwapCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SwapCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
