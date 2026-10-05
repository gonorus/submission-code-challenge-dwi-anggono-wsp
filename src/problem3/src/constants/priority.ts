import { Blockchain } from '@models/blockchain';

export const UNSUPPORTED_PRIORITY = -99;

// Solution for [8]: Replaced inefficient linear switch case with O(1) Record mapping.
export const PRIORITY_MAP: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};
