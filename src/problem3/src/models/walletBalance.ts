import { Blockchain } from './blockchain';

export interface WalletBalance {
  currency: string;
  amount: number;
  // Solution for [10]: Properly defined interface containing 'blockchain' property.
  blockchain: Blockchain;
}

export interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
