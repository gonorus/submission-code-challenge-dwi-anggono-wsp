import { describe, it, expect } from 'vitest';
import { getDesignTokens } from './theme';

describe('theme', () => {
  it('returns dark mode tokens', () => {
    const tokens = getDesignTokens('dark');
    expect(tokens.palette?.mode).toBe('dark');
    expect((tokens.palette?.background as any)?.default).toBe('#1b1b1f');
  });

  it('returns light mode tokens', () => {
    const tokens = getDesignTokens('light');
    expect(tokens.palette?.mode).toBe('light');
    expect((tokens.palette?.background as any)?.default).toBe('#f8fafc');
  });
});
