/**
 * Method B: closed-form arithmetic series (Gauss formula).
 *
 * For n >= 0 the sum is n * (n + 1) / 2. For negative n the series is
 * mirrored (sum_to_n(-n) === -sum_to_n(n)), so the formula is applied to |n|
 * and the sign is restored. The raw formula must not be used on negative
 * input: it would yield +3 for n = -3 instead of -6.
 *
 * Time:  O(1) - a fixed number of operations regardless of n.
 * Space: O(1).
 */
export function sumToNGaussFormula(n: number): number {
  const abs = Math.abs(n);
  const sum = (abs * (abs + 1)) / 2;
  return n < 0 ? -sum : sum;
}
