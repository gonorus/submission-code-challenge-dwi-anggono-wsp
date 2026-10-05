import type { Meta, StoryObj } from '@storybook/react';
import SwapForm from './SwapForm';

const meta = {
  title: 'Organisms/SwapForm',
  component: SwapForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onAmountChange: { action: 'amount changed' },
    onFromCurrencyChange: { action: 'from currency changed' },
    onToCurrencyChange: { action: 'to currency changed' },
    onSwapCurrencies: { action: 'swapped currencies' },
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof SwapForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amount: '100',
    outputAmount: '99.5',
    fromCurrency: 'USDC',
    toCurrency: 'BUSD',
    availableForPay: ['USDC', 'BUSD', 'ETH'],
    availableForReceive: ['USDC', 'BUSD', 'ETH'],
    isFormValid: true,
    buttonText: 'Swap',
    onAmountChange: () => {},
    onFromCurrencyChange: () => {},
    onToCurrencyChange: () => {},
    onSwapCurrencies: () => {},
    onSubmit: (e) => e.preventDefault(),
  },
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    amount: '0',
    outputAmount: '0.000000',
    isFormValid: false,
    buttonText: 'Enter an amount',
  },
};
