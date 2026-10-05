import { describe, it, expect } from 'vitest';
import { getPriority } from './priority';

describe('priority utils', () => {
  it('should return correct priority for known blockchains', () => {
    expect(getPriority('Osmosis')).toBe(100);
    expect(getPriority('Ethereum')).toBe(50);
    expect(getPriority('Arbitrum')).toBe(30);
    expect(getPriority('Zilliqa')).toBe(20);
    expect(getPriority('Neo')).toBe(20);
  });

  it('should return UNSUPPORTED_PRIORITY (-99) for unknown blockchains', () => {
    // @ts-expect-error Testing invalid input
    expect(getPriority('UnknownChain')).toBe(-99);
  });
});
