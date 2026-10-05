import type { Meta, StoryObj } from '@storybook/react';
import TokenSelector from './TokenSelector';

const meta = {
  title: 'Molecules/TokenSelector',
  component: TokenSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof TokenSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTokens = ['ETH', 'BTC', 'USDT', 'LUNA'];

export const Default: Story = {
  args: {
    label: 'Select Token',
    value: 'ETH',
    availableTokens: defaultTokens,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Select Token',
    value: 'BTC',
    availableTokens: defaultTokens,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Select Token',
    value: 'USDT',
    availableTokens: defaultTokens,
    readOnly: true,
  },
};

export const EmptyTokens: Story = {
  args: {
    label: 'No Tokens',
    value: '',
    availableTokens: [],
  },
};
