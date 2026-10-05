import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

declare global {
  namespace Chai {
    interface Assertion {
      toHaveNoViolations(): void;
    }
  }
}

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});
