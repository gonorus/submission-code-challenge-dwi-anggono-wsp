import { useMemo } from 'react';
import { WalletBalance, FormattedWalletBalance } from '@models/walletBalance';
import { getPriority } from '@utils/priority';
import { formatCurrency } from '@utils/formatters';
import { UNSUPPORTED_PRIORITY } from '@constants/priority';

export const useFormattedWallet = (balances: WalletBalance[]): FormattedWalletBalance[] => {
  // Solution for [18]: Fully encapsulated formatting and mapping arrays inside the useMemo block.
  return useMemo(() => {
    return (
      balances
        .filter((balance) => {
          const priority = getPriority(balance.blockchain);
          // Solution for [11] & [12]: Handled fallback priority without crashing and corrected filter predicate.
          return priority > UNSUPPORTED_PRIORITY && balance.amount > 0;
        })
        // Solution for [13], [14], & [15]: Mapped priority upfront, then filtered and sorted safely without mutating original arrays.
        .map((balance) => ({
          ...balance,
          priority: getPriority(balance.blockchain),
        }))
        // Solution for [16] & [17]: Stable sort comparator that safely handles '0' returns and deterministic alphabetical tie-breaking.
        .sort((lhs, rhs) => {
          if (lhs.priority !== rhs.priority) {
            return rhs.priority - lhs.priority;
          }
          return lhs.currency.localeCompare(rhs.currency);
        })
        .map(({ priority: _priority, ...balance }) => ({
          ...balance,
          formatted: formatCurrency(balance.amount),
        }))
    );
    // Solution for [9]: Removed 'prices' from dependency array to prevent infinite re-sorting on price ticks.
  }, [balances]);
};
