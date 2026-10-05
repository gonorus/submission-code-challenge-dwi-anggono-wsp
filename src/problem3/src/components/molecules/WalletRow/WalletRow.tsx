import { memo } from 'react';

export interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}

export const WalletRow = memo(
  ({ amount, usdValue, formattedAmount, className }: WalletRowProps) => (
    <div className={className}>
      {amount} - {usdValue} - {formattedAmount}
    </div>
  ),
);
WalletRow.displayName = 'WalletRow';
