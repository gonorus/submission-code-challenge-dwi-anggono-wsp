import { describe, it, expect, vi } from 'vitest';
import { dedupePrices } from './prices';

describe('dedupePrices', () => {
  it('keeps the most recent row per currency', () => {
    const result = dedupePrices([
      { currency: 'USDC', date: '2023-08-29T07:10:30.000Z', price: 1 },
      { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 0.99 },
    ]);
    expect(result).toEqual({ USDC: 0.99 });
  });

  it('prefers the later row in the response when dates are equal', () => {
    const result = dedupePrices([
      { currency: 'BUSD', date: '2023-08-29T07:10:40.000Z', price: 0.9991 },
      { currency: 'BUSD', date: '2023-08-29T07:10:40.000Z', price: 0.9998 },
    ]);
    expect(result.BUSD).toBe(0.9998);
  });

  it('is not fooled by a later row with an older date', () => {
    const result = dedupePrices([
      { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 0.9999 },
      { currency: 'USDC', date: '2023-08-29T07:10:30.000Z', price: 1 },
    ]);
    expect(result.USDC).toBe(0.9999);
  });

  it('ignores invalid prices and returns unique currencies', () => {
    const result = dedupePrices([
      { currency: 'A', price: 0 },
      { currency: 'B', price: undefined },
      { currency: 'C', price: -1 },
      { currency: 'D', price: 2 },
    ]);
    expect(result).toEqual({ D: 2 });
  });

  it('ignores invalid rows, missing currencies, and handles missing/invalid dates', () => {
    const result = dedupePrices([
      null as any, // !row branch
      { currency: '', price: 1 }, // !row.currency branch
      { currency: 123 as any, price: 1 }, // typeof row.currency !== 'string' branch
      { currency: 'NO_DATE', price: 1 }, // row.date is undefined branch
      { currency: 'INVALID_DATE', date: 'invalid', price: 2 }, // Date.parse is NaN branch
      { currency: 'INVALID_DATE', date: '2023-01-01T00:00:00Z', price: 3 }, // valid date to override
    ]);
    expect(result).toEqual({ NO_DATE: 1, INVALID_DATE: 3 });
  });
});

describe('fetchPrices', () => {
  it('throws an error if response is not an array', async () => {
    const { fetchPrices } = await import('./prices');

    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ not: 'an array' }),
    });

    await expect(fetchPrices()).rejects.toThrow('Unexpected prices response');
  });
});
