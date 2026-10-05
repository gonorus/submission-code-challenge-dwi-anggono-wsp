import type { Meta, StoryObj } from '@storybook/react';
import SwapProgress from './SwapProgress';

const meta = {
  title: 'Organisms/SwapProgress',
  component: SwapProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SwapProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    payAmount: '100',
    payToken: 'USDC',
    receiveAmount: '100',
    receiveToken: 'BUSD',
  },
};
