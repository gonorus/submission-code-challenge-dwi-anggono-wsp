import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletList } from './WalletList';
import { FormattedWalletBalance } from '@models/walletBalance';

describe('WalletList Component', () => {
  it('renders a list of wallet rows and computes usd value correctly', () => {
    const balances: FormattedWalletBalance[] = [
      { currency: 'ETH', amount: 2, blockchain: 'Ethereum', formatted: '2.00' },
      { currency: 'OSMO', amount: 10, blockchain: 'Osmosis', formatted: '10.00' },
    ];

    const prices = {
      ETH: 2000,
      // Missing OSMO price to test fallback to 0
    };

    render(<WalletList balances={balances} prices={prices} />);

    // Check ETH row (2 * 2000 = 4000)
    expect(screen.getByText(/2\.00/)).toBeInTheDocument();
    expect(screen.getByText(/4000/)).toBeInTheDocument();

    // Check OSMO row (10 * 0 = 0)
    expect(screen.getByText(/10\.00/)).toBeInTheDocument();
    expect(screen.getAllByText(/0/)[0]).toBeInTheDocument();
  });
});
