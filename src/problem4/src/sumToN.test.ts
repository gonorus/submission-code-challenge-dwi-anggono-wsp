import { describe, expect, it } from 'vitest';
import {
  sumToNGaussFormula,
  sumToNIterativeLoop,
  sumToNTrampolinedRecursion,
} from '@/index';

const implementations = [
  ['sumToNIterativeLoop', sumToNIterativeLoop],
  ['sumToNGaussFormula', sumToNGaussFormula],
  ['sumToNTrampolinedRecursion', sumToNTrampolinedRecursion],
] as const;

describe.each(implementations)('%s', (_name, fn) => {
  it.each([
    [1, 1],
    [2, 3],
    [5, 15],
    [10, 55],
    [100, 5050],
  ])('positive: sum_to_n(%i) === %i', (n, expected) => {
    expect(fn(n)).toBe(expected);
  });

  it('zero: sum_to_n(0) === 0', () => {
    expect(fn(0)).toBe(0);
  });

  it('negative zero: sum_to_n(-0) === 0', () => {
    expect(fn(-0) === 0).toBe(true);
  });

  it.each([
    [-1, -1],
    [-2, -3],
    [-5, -15],
    [-10, -55],
    [-100, -5050],
  ])('negative: sum_to_n(%i) === %i', (n, expected) => {
    expect(fn(n)).toBe(expected);
  });

  it.each([1, 7, 42, 1000])('symmetry: f(-%i) === -f(%i)', (n) => {
    expect(fn(-n)).toBe(-fn(n));
  });
});

describe('equivalence between implementations', () => {
  it('all methods agree for every n in [-200, 200]', () => {
    for (let n = -200; n <= 200; n++) {
      const expected = sumToNGaussFormula(n);
      expect(sumToNIterativeLoop(n)).toBe(expected);
      expect(sumToNTrampolinedRecursion(n)).toBe(expected);
    }
  });
});

describe('large inputs', () => {
  it.each([1_000_000, -1_000_000])('loop and formula agree for n = %i', (n) => {
    expect(sumToNIterativeLoop(n)).toBe(sumToNGaussFormula(n));
  });

  it.each([100_000, -100_000, 1_000_000, -1_000_000])(
    'trampolined recursion does not overflow the stack for n = %i',
    (n) => {
      expect(() => sumToNTrampolinedRecursion(n)).not.toThrow();
      expect(sumToNTrampolinedRecursion(n)).toBe(sumToNGaussFormula(n));
    },
  );

  it.each([94_906_264, -94_906_264])(
    'loop and formula agree near the safe-integer limit for n = %i',
    (n) => {
      const result = sumToNGaussFormula(n);
      expect(Number.isSafeInteger(result)).toBe(true);
      expect(sumToNIterativeLoop(n)).toBe(result);
    },
  );
});
