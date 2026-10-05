import type { Meta, StoryObj } from '@storybook/react';
import SwapSuccess from './SwapSuccess';

const meta = {
  title: 'Organisms/SwapSuccess',
  component: SwapSuccess,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onConfirm: { action: 'confirmed' },
  },
} satisfies Meta<typeof SwapSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onConfirm: () => {},
  },
};
