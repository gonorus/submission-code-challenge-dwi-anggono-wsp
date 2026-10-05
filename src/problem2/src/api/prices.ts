import { useQuery } from '@tanstack/react-query';

export const PRICES_URL = import.meta.env.VITE_PRICE_API_URL as string;

export interface PriceRow {
  currency: string;
  date?: string;
  price?: number;
}

/**
 * Reduces raw price rows into one valid price per currency.
 * - Rows with a non-finite or non-positive price are ignored.
 * - For duplicates, the row with the most recent `date` wins; on equal dates
 *   (or missing dates) the row that appears last in the response wins.
 */
export function dedupePrices(rows: PriceRow[]): Record<string, number> {
  const latest = new Map<string, { time: number; price: number }>();

  for (const row of rows) {
    if (!row || typeof row.currency !== 'string' || !row.currency) continue;
    if (typeof row.price !== 'number' || !Number.isFinite(row.price) || row.price <= 0) continue;

    const time = row.date ? Date.parse(row.date) || 0 : 0;
    const existing = latest.get(row.currency);
    if (!existing || time >= existing.time) {
      latest.set(row.currency, { time, price: row.price });
    }
  }

  const result: Record<string, number> = {};
  latest.forEach(({ price }, currency) => {
    result[currency] = price;
  });
  return result;
}

export async function fetchPrices(): Promise<PriceRow[]> {
  const res = await fetch(PRICES_URL);
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error('Unexpected prices response');
  return data as PriceRow[];
}

export function usePrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    select: dedupePrices,
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}
