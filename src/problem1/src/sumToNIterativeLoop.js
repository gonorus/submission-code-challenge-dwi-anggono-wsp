/**
 * Method A: Iterative loop
 *
 * Time:  O(|n|) - loops exactly |n| times.
 * Space: O(1)   - updates a single accumulator variable.
 *
 * @param {number} n
 * @returns {number}
 */
export function sumToNIterativeLoop(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError('Input n must be an integer');
  }

  let sum = 0;
  const isNegative = n < 0;
  const target = Math.abs(n);

  for (let i = 1; i <= target; i++) {
    sum += i;
  }

  return isNegative ? -sum : sum;
}
