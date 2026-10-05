import { describe, it, expect } from 'vitest';
import { getIconUrl } from './icon';

describe('icon', () => {
  it('returns correctly overridden icon url for upper-cased liquid staking tokens', () => {
    expect(getIconUrl('STATOM')).toMatch(/\/stATOM\.svg$/);
    expect(getIconUrl('RATOM')).toMatch(/\/rATOM\.svg$/);
  });

  it('returns correctly for normal tokens', () => {
    expect(getIconUrl('USDC')).toMatch(/\/USDC\.svg$/);
  });
});
