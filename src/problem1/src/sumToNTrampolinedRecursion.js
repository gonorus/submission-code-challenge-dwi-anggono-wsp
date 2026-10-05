/**
 * Method C: recursion with trampolining.
 *
 * A plain recursive `n + f(n - 1)` adds one stack frame per integer and throws
 * `RangeError: Maximum call stack size exceeded` beyond roughly 10k frames.
 * Here each recursive step returns a thunk (a function holding the next step)
 * instead of calling itself, and `trampoline` runs the thunks in a loop, so the
 * call stack never grows.
 *
 * Time:  O(|n|) - one thunk per integer.
 * Space: O(1) call stack. Each step still allocates one short-lived closure,
 *        so it is slower than the plain loop (Method A).
 *
 * @param {number} n
 * @returns {number}
 */

/**
 * Trampoline runner that continually executes functions until a non-function value is returned.
 * @param {Function | number} result
 * @returns {number}
 */
function trampoline(result) {
  while (typeof result === 'function') {
    result = result();
  }
  return result;
}

/**
 * Recursive step for summing.
 * @param {number} n
 * @param {number} acc
 * @returns {Function | number}
 */
function sumStep(n, acc) {
  if (n === 0) return acc;
  const next = n > 0 ? n - 1 : n + 1;
  return () => sumStep(next, acc + n);
}

/**
 * Trampolined wrapper.
 * @param {number} n
 * @returns {number}
 */
export function sumToNTrampolinedRecursion(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError('Input n must be an integer');
  }

  return trampoline(sumStep(n, 0));
}
