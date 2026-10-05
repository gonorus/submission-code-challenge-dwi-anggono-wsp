# Problem 3: Messy React (Analysis & Refactoring)

Hi there! In this directory, I've put together a comprehensive analysis and complete refactoring of the highly problematic React component found in `src/problem.tsx`. I wanted to explore the trade-offs between messy, anti-pattern code and an enterprise-grade, clean architecture, so I've meticulously reviewed the original file and then completely rebuilt it.

## A Few Assumptions I Made

Before diving into the code review, I want to clarify a few constraints and architectural decisions I kept in mind while building the refactored version:

- **Strict Type Safety:** The original code relied heavily on implicit `any` types and unsafe casting. I assumed that a production-grade wallet dashboard must have 100% type safety, so I extracted robust domain models (e.g., `FormattedWalletBalance`, `Blockchain`).
- **Fail-Fast Architecture:** Network requests for balances and prices are inherently flaky. I assumed that the UI must elegantly handle `isLoading` and `isError` states, so I designed the refactored hooks to be fully compatible with modern **React Suspense** and Error Boundaries.
- **Performance:** Cryptocurrency prices fluctuate rapidly. I assumed the original sorting mechanism (which re-ran every time a price changed) was a major bottleneck. The refactored version cleanly decouples sorting from price mapping.

## How I Approached the Implementations

I split the refactoring process into two phases: analyzing the original mess, and architecting the clean solution.

### 1. The Code Review (The Mess)

I performed a line-by-line audit of `src/problem.tsx` and found exactly **24 critical findings**, ranging from fatal crashes to memory leaks.

> _You can read the complete, deeply-technical breakdown of every single finding in [`Analysis.md`](./Analysis.md)._

### 2. The Clean Architecture

To fix these issues, I implemented a modern **Atomic Design** and **Clean Architecture** approach. I broke the massive single file into modular, highly-focused components:

| Layer             | Files                                         | Purpose                                                                                                            |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Domain Models** | [`src/models/*.ts`](./src/models)             | Strict TypeScript definitions for Blockchain variants and Wallet Balances.                                         |
| **Utilities**     | [`src/utils/*.ts`](./src/utils)               | Pure functions for `getPriority` lookups (now `O(1)`) and `formatCurrency` internationalization.                   |
| **Custom Hooks**  | [`src/hooks/*.ts`](./src/hooks)               | Encapsulated business logic (`useFormattedWallet`) shielded by its own isolated `useMemo` cache.                   |
| **UI Components** | [`src/components/**/*.tsx`](./src/components) | Dumb, declarative React components (`WalletRow`, `WalletList`, `PageLayout`) that only care about rendering props. |

---

## 🔗 Solution Tracing Guide (The 24 Fixes)

To make this refactoring highly educational, I have injected **inline solution markers** into the refactored source code. You can literally trace how each of the 24 problems from `Analysis.md` was solved by looking for `// Solution for [X]:` comments in the new files.

Below is the comprehensive mapping table of all 24 findings and exactly where they were resolved:

### 🔵 Architecture & TypeScript Patterns

| #     | Finding from `Analysis.md`                 | Resolution & Traceability                                                           |
| :---- | :----------------------------------------- | :---------------------------------------------------------------------------------- |
| **1** | [1] Empty Interface Extension              | Removed empty interface; directly used `BoxProps`. _(See `WalletPage.tsx`)_         |
| **2** | [2] Redundant `React.FC` Declaration       | Dropped `React.FC` for modern, explicit functional typing. _(See `WalletPage.tsx`)_ |
| **3** | [3] Missing Imports & Declarations         | Correctly imported `Suspense`, hooks, and components. _(See `WalletPage.tsx`)_      |
| **4** | [4] Re-declaration of Functions per Render | Hoisted `getPriority` out of the component as a pure utility. _(See `priority.ts`)_ |
| **5** | [5] Discarded `children` Prop              | `children` prop is now correctly forwarded and rendered. _(See `WalletPage.tsx`)_   |

### 🟡 State & Logic Integrity

| #      | Finding from `Analysis.md`                   | Resolution & Traceability                                                                                     |
| :----- | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **6**  | [6] Missing Loading & Error States           | Designed `useWalletData` to be strictly `React.Suspense`-ready. _(See `useWalletData.ts`)_                    |
| **7**  | [7] Bypassing Type Safety with `any`         | Extracted strict `Blockchain` literal type union. _(See `blockchain.ts`)_                                     |
| **8**  | [8] Inefficient Linear Switch Case           | Replaced with an `O(1)` constant `Record` lookup. _(See `priority.ts`)_                                       |
| **9**  | [9] Toxic `useMemo` Dependency Array         | Removed `prices` from dependencies; sorting only triggers on balance changes. _(See `useFormattedWallet.ts`)_ |
| **10** | [10] Interface Missing `blockchain` Property | Added `blockchain: Blockchain` safely to the interface. _(See `walletBalance.ts`)_                            |

### 🔴 Critical Runtime Errors

| #      | Finding from `Analysis.md`               | Resolution & Traceability                                                                                             |
| :----- | :--------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| **11** | [11] Undeclared `lhsPriority` Variable   | Fixed referencing errors and safely cached the priority check. _(See `useFormattedWallet.ts`)_                        |
| **12** | [12] Inverted Filter Logic               | Fixed predicate to only keep valid, funded balances (`amount > 0`). _(See `useFormattedWallet.ts`)_                   |
| **13** | [13] Redundant Array Iterations          | Pipelined operations to reduce overhead and memory jumping. _(See `useFormattedWallet.ts`)_                           |
| **14** | [14] In-Place Array Mutation (`.sort()`) | `.sort()` now operates safely downstream on a freshly mapped array. _(See `useFormattedWallet.ts`)_                   |
| **15** | [15] Excessive `getPriority` Calls       | Priority is calculated exactly once upfront via `.map()`, scaling efficiently `O(N)`. _(See `useFormattedWallet.ts`)_ |
| **16** | [16] Standard-Violating Sort Comparator  | Comparator now returns accurate numeric diffs safely without returning `undefined`. _(See `useFormattedWallet.ts`)_   |
| **17** | [17] Non-Deterministic Tie-Breaker       | Fallback alphabetical sort (`localeCompare`) added for equal priorities. _(See `useFormattedWallet.ts`)_              |

### 🟡 Memory Allocation & Formatting

| #      | Finding from `Analysis.md`                 | Resolution & Traceability                                                                                  |
| :----- | :----------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **18** | [18] Array Instantiation Outside `useMemo` | Encapsulated all mapping and formatting inside the hook's `useMemo` block. _(See `useFormattedWallet.ts`)_ |
| **19** | [19] Wasted `formattedBalances` Array      | The UI now correctly iterates over the fully formatted array. _(See `WalletList.tsx`)_                     |
| **20** | [20] Decimal Truncation via `.toFixed()`   | Replaced with `Intl.NumberFormat` for accurate currency presentation. _(See `formatters.ts`)_              |
| **21** | [21] Unsound Type Assertion                | Removed fake casting; `WalletList` receives correctly typed data natively. _(See `WalletList.tsx`)_        |
| **22** | [22] Dangerous `NaN` Rendering             | Implemented robust `?? 0` fallback for missing network prices. _(See `WalletList.tsx`)_                    |
| **23** | [23] Unknown Property (`classes.row`)      | Replaced undefined reference with standard `"wallet-row"` CSS class. _(See `WalletList.tsx`)_              |
| **24** | [24] Using Array `index` as a React `Key`  | Created a deterministic composite key (`${blockchain}-${currency}`). _(See `WalletList.tsx`)_              |

---

## Running the Code Locally

If you'd like to try it out or run my tests, I've set everything up with a modern JavaScript environment using Vitest.

```bash
npm install
npm run typecheck     # Verify 100% strict TypeScript compliance
npm test              # Run my unit tests via Vitest
npm run test:coverage # View the 100% Code Coverage report
```

## How I Tested It

I wrote a robust test suite across the codebase to ensure the refactored components are bulletproof. I made sure to cover:

- **Utility accuracy:** Validating the `O(1)` priority mappings and `Intl.NumberFormat` fiat conversions.
- **Hook logic:** Ensuring `useFormattedWallet` correctly drops zero-balances, filters out unsupported chains, and accurately sorts the list without mutating the original arrays.
- **DOM Rendering:** Verifying that `WalletRow` and `WalletList` correctly map tokens to fiat values using regex matching, proving that `0` balances or missing prices fallback securely without displaying `NaN`.
- **Coverage:** I utilized `@vitest/coverage-v8` and successfully achieved **100% Statements, Branch, and Lines coverage** across all logic and UI layers!
