import { test } from 'vitest';
import {
  sumToNGaussFormula,
  sumToNIterativeLoop,
  sumToNTrampolinedRecursion,
} from '@/index.js';

const sizes = [10, 1_000, 100_000, 1_000_000];

// Each size runs three benchmarks of ~1s each, so allow more than the default timeout.
const TIMEOUT_MS = 30_000;

for (const n of sizes) {
  test(
    `sum_to_n(${n.toLocaleString('en-US')})`,
    { timeout: TIMEOUT_MS },
    async ({ bench }) => {
      await bench('iterative loop', () => {
        sumToNIterativeLoop(n);
      }).run();

      await bench('gauss formula', () => {
        sumToNGaussFormula(n);
      }).run();

      await bench('trampolined recursion', () => {
        sumToNTrampolinedRecursion(n);
      }).run();
    },
  );
}
