import type { Meta, StoryObj } from '@storybook/react';
import AmountInput from './AmountInput';

const meta = {
  title: 'Molecules/AmountInput',
  component: AmountInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof AmountInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Amount',
    value: '1000',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Amount',
    value: '1000',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Amount',
    value: '1000',
    readOnly: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Amount',
    value: '1000',
    error: true,
    helperText: 'Insufficient balance',
  },
};
