import { Blockchain } from '@models/blockchain';
import { PRIORITY_MAP, UNSUPPORTED_PRIORITY } from '@constants/priority';

// Solution for [4]: Hoisted getPriority function outside the component to prevent re-declaration per render.
export const getPriority = (blockchain: Blockchain): number => {
  return PRIORITY_MAP[blockchain] ?? UNSUPPORTED_PRIORITY;
};
