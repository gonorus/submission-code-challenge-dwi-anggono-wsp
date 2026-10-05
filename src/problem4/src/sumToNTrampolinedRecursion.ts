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
 */
type Thunk<T> = () => T | Thunk<T>;

function trampoline<T>(result: T | Thunk<T>): T {
  while (typeof result === 'function') {
    result = (result as Thunk<T>)();
  }
  return result;
}

function sumStep(n: number, acc: number): number | Thunk<number> {
  if (n === 0) return acc;
  const next = n > 0 ? n - 1 : n + 1;
  return () => sumStep(next, acc + n);
}

export function sumToNTrampolinedRecursion(n: number): number {
  return trampoline(sumStep(n, 0));
}
