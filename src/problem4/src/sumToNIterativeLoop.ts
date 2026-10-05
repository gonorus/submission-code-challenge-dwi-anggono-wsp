/**
 * Method A: iterative loop.
 *
 * Walks from 0 towards `n` one step at a time (+1 for positive `n`, -1 for
 * negative `n`), accumulating every integer along the way.
 *
 * Time:  O(|n|) - one addition per integer.
 * Space: O(1)   - a single accumulator.
 */
export function sumToNIterativeLoop(n: number): number {
  const step = n >= 0 ? 1 : -1;
  let sum = 0;
  for (let i = step; i !== n + step; i += step) {
    sum += i;
  }
  return sum;
}
