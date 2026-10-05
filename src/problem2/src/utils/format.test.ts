import { describe, it, expect } from 'vitest';
import { formatCurrency, parseCurrency } from './format';

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('TC-01: Returns empty string for empty input', () => {
      expect(formatCurrency('')).toBe('');
    });

    it('TC-02: Returns empty string for invalid numbers', () => {
      expect(formatCurrency('abc')).toBe('');
      expect(formatCurrency(NaN)).toBe('');
    });

    it('TC-03: Formats integer with commas', () => {
      expect(formatCurrency('1000')).toBe('1,000');
      expect(formatCurrency(1000000)).toBe('1,000,000');
    });

    it('TC-04: Formats decimals correctly up to 6 digits', () => {
      expect(formatCurrency('1000.123456')).toBe('1,000.123456');
    });

    it('TC-05: Truncates decimals exceeding 6 digits via rounding', () => {
      // Intl.NumberFormat rounds up/down based on the 7th digit
      expect(formatCurrency('1000.1234567')).toBe('1,000.123457');
    });
  });

  describe('parseCurrency', () => {
    it('TC-06: Removes all commas from formatted string', () => {
      expect(parseCurrency('1,000,000.50')).toBe('1000000.50');
      expect(parseCurrency('1,234')).toBe('1234');
    });

    it('TC-07: Leaves non-comma characters intact', () => {
      expect(parseCurrency('abc.123')).toBe('abc.123');
    });
  });
});
