import type { Meta, StoryObj } from '@storybook/react';
import TokenIcon, { TokenIconSkeleton } from './TokenIcon';

const meta = {
  title: 'Atoms/TokenIcon',
  component: TokenIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    symbol: { control: 'text' },
    size: { control: { type: 'range', min: 16, max: 128, step: 4 } },
  },
} satisfies Meta<typeof TokenIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    symbol: 'ETH',
    size: 40,
  },
};

export const MissingIconFallback: Story = {
  args: {
    symbol: 'UNKNOWN_COIN',
    size: 40,
  },
};

export const Large: Story = {
  args: {
    symbol: 'BTC',
    size: 80,
  },
};

export const LoadingState: StoryObj<typeof TokenIconSkeleton> = {
  render: (args) => <TokenIconSkeleton {...args} />,
  args: {
    size: 40,
  },
};
