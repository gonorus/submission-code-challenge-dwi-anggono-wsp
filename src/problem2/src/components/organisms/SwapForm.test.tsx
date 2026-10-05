import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SwapForm from './SwapForm';

describe('SwapForm', () => {
  const defaultProps = {
    amount: '10',
    onAmountChange: vi.fn(),
    outputAmount: '9.9',
    fromCurrency: 'USDC',
    onFromCurrencyChange: vi.fn(),
    availableForPay: ['USDC', 'BUSD'],
    toCurrency: 'BUSD',
    onToCurrencyChange: vi.fn(),
    availableForReceive: ['USDC', 'BUSD'],
    onSwapCurrencies: vi.fn(),
    onSubmit: vi.fn((e) => e.preventDefault()),
    isFormValid: true,
    buttonText: 'Swap',
  };

  it('renders form inputs and submit button', () => {
    render(<SwapForm {...defaultProps} />);

    expect(screen.getByText('Quick Swap')).toBeInTheDocument();

    const inputs = screen.getAllByRole('textbox');
    // AmountInput has role textbox, Autocomplete uses combobox
    expect(inputs.length).toBeGreaterThan(0);

    const submitButton = screen.getByRole('button', { name: 'Swap' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onSwapCurrencies when swap icon is clicked', () => {
    render(<SwapForm {...defaultProps} />);
    const swapBtn = screen.getByRole('button', { name: /swap currencies/i });
    fireEvent.click(swapBtn);
    expect(defaultProps.onSwapCurrencies).toHaveBeenCalledTimes(1);
  });

  it('disables submit button when isFormValid is false', () => {
    render(<SwapForm {...defaultProps} isFormValid={false} buttonText="Enter an amount" />);
    const submitButton = screen.getByRole('button', { name: 'Enter an amount' });
    expect(submitButton).toBeDisabled();
  });
});
