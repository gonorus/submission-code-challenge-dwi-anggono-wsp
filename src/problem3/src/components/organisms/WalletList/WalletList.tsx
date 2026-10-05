import { FormattedWalletBalance } from '@models/walletBalance';
import { WalletRow } from '@molecules/WalletRow';

interface WalletListProps {
  balances: FormattedWalletBalance[];
  prices: Record<string, number>;
}

// Solution for [19] & [21]: Directly mapped over fully formatted balances with sound TypeScript props.
export const WalletList = ({ balances, prices }: WalletListProps) => {
  return (
    <>
      {balances.map((balance) => {
        // Solution for [22]: Handled missing price feeds with fallback '?? 0' to prevent NaN rendering.
        const price = prices[balance.currency] ?? 0;
        const usdValue = price * balance.amount;

        return (
          <WalletRow
            // Solution for [23]: Removed undefined 'classes.row' property and replaced with standard string class.
            className="wallet-row"
            // Solution for [24]: Used composite key (blockchain + currency) instead of volatile array index.
            key={`${balance.blockchain}-${balance.currency}`}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      })}
    </>
  );
};
