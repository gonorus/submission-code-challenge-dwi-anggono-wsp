import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatters';

describe('formatters utils', () => {
  it('should format numbers according to Intl rules (max 6 decimals)', () => {
    expect(formatCurrency(123.456)).toBe('123.456');
    expect(formatCurrency(100)).toBe('100');
    expect(formatCurrency(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-50.5)).toBe('-50.5');
  });
});
