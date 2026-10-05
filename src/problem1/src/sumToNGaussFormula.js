/**
 * Method B: Closed-form formula (Gauss)
 *
 * Uses `n * (n + 1) / 2` mapped for positive and negative cases.
 *
 * Time:  O(1) - single arithmetic step.
 * Space: O(1) - no loop or call stack allocations.
 *
 * @param {number} n
 * @returns {number}
 */
export function sumToNGaussFormula(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError('Input n must be an integer');
  }

  const absoluteN = Math.abs(n);
  const sum = (absoluteN * (absoluteN + 1)) / 2;
  return n < 0 ? -sum : sum;
}
