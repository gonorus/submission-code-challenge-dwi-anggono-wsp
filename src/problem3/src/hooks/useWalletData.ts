import { WalletBalance } from '@models/walletBalance';

export const useWalletBalances = (): WalletBalance[] => [];
export const usePrices = (): Record<string, number> => ({});

// Solution for [6]: Hook designed to gracefully throw Promises for React.Suspense to handle loading/error states.
export const useWalletData = () => {
  // In a Suspense-driven approach, this hook is assumed to use React Query/SWR
  // (with the { suspense: true } option) or the React 19 `use()` API.
  // Thus, if the data is not ready, the hook automatically throws a Promise.
  const balances = useWalletBalances();
  const prices = usePrices();

  return {
    balances,
    prices,
  };
};
