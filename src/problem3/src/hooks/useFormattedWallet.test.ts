import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormattedWallet } from './useFormattedWallet';
import { WalletBalance } from '@models/walletBalance';

describe('useFormattedWallet', () => {
  it('should filter out balances with amount <= 0 and unsupported blockchains, sort them by priority, and format them', () => {
    const mockBalances: WalletBalance[] = [
      { currency: 'OSMO', amount: 0, blockchain: 'Osmosis' }, // Filtered out (amount = 0)
      { currency: 'ETH', amount: -10, blockchain: 'Ethereum' }, // Filtered out (amount < 0)
      { currency: 'UNK', amount: 50, blockchain: 'Unknown' as any }, // Filtered out (priority = -99)
      { currency: 'NEO', amount: 10, blockchain: 'Neo' }, // Included, priority 20
      { currency: 'ETH2', amount: 5, blockchain: 'Ethereum' }, // Included, priority 50
      { currency: 'ZIL', amount: 20, blockchain: 'Zilliqa' }, // Included, priority 20
    ];

    const { result } = renderHook(() => useFormattedWallet(mockBalances));

    const formatted = result.current;

    // Only 3 should remain
    expect(formatted.length).toBe(3);

    // Sorting order: Ethereum (50), Neo (20), Zilliqa (20) (wait, Neo vs Zilliqa depends on original order or tiebreak)
    // Based on priority: ETH2 should be first
    expect(formatted[0].currency).toBe('ETH2');
    expect(formatted[0].amount).toBe(5);
    expect(formatted[0].formatted).toBe('5');

    // The remaining two are priority 20
    expect(formatted[1].currency).toBe('NEO');
    expect(formatted[2].currency).toBe('ZIL');
  });
});
