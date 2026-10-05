# Problem 3: Messy React (Analysis)

This repository contains a **Code Review Analysis** of a highly messy, anti-pattern-ridden, and bug-prone React component found in `src/problem.tsx`.

A rigorous, line-by-line inspection has been conducted from top to bottom. You can cross-reference each of the findings below with the corresponding `[1]` through `[24]` markers embedded directly in the `src/problem.tsx` source code.

---

## 🛠️ Code Review Findings (Chronological Order)

### 🔵 Architecture & TypeScript Patterns

#### 1. [1] Empty Interface Extension

Declaring `interface Props extends BoxProps {}` is a TypeScript anti-pattern. It adds compilation overhead without providing any structural value or new properties.

#### 2. [2] Redundant `React.FC` Declaration

Using `const WalletPage: React.FC<Props> = (props: Props)` is redundant and outdated. `React.FC` introduces implicit `children` handling and clutters the component stack trace.

#### 3. [3] Missing Imports & Declarations

Seven entities (`BoxProps`, `React`, `useWalletBalances`, `usePrices`, `useMemo`, `WalletRow`, and `classes`) are invoked without being imported. This triggers immediate `ReferenceError`s and makes the file impossible to compile.

#### 4. [4] Re-declaration of Functions per Render

The `getPriority` function is declared inside the component body. It gets destroyed and re-allocated in memory every single time `WalletPage` re-renders.

#### 5. [5] Discarded `children` Prop

The `children` variable is destructured from `props` but completely ignored in the returned JSX tree.

### 🟡 State & Logic Integrity

#### 6. [6] Missing Loading & Error States

The component assumes `useWalletBalances()` fetches data instantaneously and never fails. This is highly dangerous for actual asynchronous network calls.

#### 7. [7] Bypassing Type Safety with `any`

Using `blockchain: any` destroys TypeScript's primary defense mechanism. Typographical errors in blockchain names will bypass compiler checks entirely.

#### 8. [8] Inefficient Linear Switch Case

Using a chained `switch-case` for priority mapping is inefficient. Given the static nature of the data, an `Object` or `Record` dictionary (O(1) lookup) is significantly cleaner and faster.

#### 9. [9] Toxic `useMemo` Dependency Array

Injecting `prices` into the `useMemo` dependency array forces the intensive sorting algorithm to re-run every time the price API ticks, even though prices are never used to determine the sort order.

#### 10. [10] Interface Missing `blockchain` Property

The `getPriority(balance.blockchain)` call errors out because the `WalletBalance` interface declaration completely lacks a `blockchain` property.

### 🔴 Critical Runtime Errors

#### 11. [11] Undeclared `lhsPriority` Variable (Fatal Crash)

The filter logic checks `if (lhsPriority > -99)`. This variable is never declared, causing the application to crash instantly with a `ReferenceError`.

#### 12. [12] Inverted Filter Logic

The condition `if (balance.amount <= 0)` hides funded wallets and only renders empty wallets to the UI.

#### 13. [13] Redundant Array Iterations

The code loops over the arrays chain-style (`filter` -> `sort` -> `map` -> `map`) up to 4 times. This continuously allocates new array memory, heavily wasting performance.

#### 14. [14] In-Place Array Mutation (`.sort()`)

JavaScript's `.sort()` mutates the original array in place. While technically safe here due to the preceding `.filter()`, it is a dangerous habit that risks corrupting reference structures.

#### 15. [15] Excessive `getPriority` Calls (O(N log N))

Inside the sort comparator, `getPriority` is executed repeatedly for each comparison. This results in the function being invoked multiple times per element (O(N log N) complexity) rather than computing the priority once per element upfront (O(N) complexity).

#### 16. [16] Standard-Violating Sort Comparator

The comparator function lacks a final fallback `return` statement. When `leftPriority` equals `rightPriority` (e.g., two coins sharing the same priority), both `if` conditions fail, causing the function to implicitly return `undefined` instead of `0`. The JavaScript `Array.prototype.sort()` specification strictly requires a numeric return value. Returning `undefined` breaks the internal sorting algorithm (e.g., Timsort in V8), resulting in unpredictable, unstable, and entirely scrambled array ordering across different browsers.

#### 17. [17] Non-Deterministic Tie-Breaker

`Zilliqa` and `Neo` share the same priority weight (`20`). Without a secondary tie-breaker (e.g., alphabetical sorting), their visual order will randomly swap upon every re-render.

### 🟡 Memory Allocation & Formatting

#### 18. [18] Array Instantiation Outside `useMemo`

Both `formattedBalances` and `rows` arrays are built outside of `useMemo`, forcing memory reallocation and re-assembly on every render cycle.

#### 19. [19] Wasted `formattedBalances` Array 🔴

The `formattedBalances` array is deliberately constructed, but the component completely ignores it and maps over `sortedBalances` instead. The formatting process is entirely wasted.

#### 20. [20] Decimal Truncation via `.toFixed()` 🔴

Calling `.toFixed()` with no arguments forcefully rounds numbers and strips all decimal points (e.g., a `0.45 BTC` balance becomes `0`).

#### 21. [21] Unsound Type Assertion 🔴

The parameter `balance` inside the `rows` map is blindly cast to `FormattedWalletBalance`. This lies to the compiler because `sortedBalances` items lack the `formatted` property at this stage.

#### 22. [22] Dangerous `NaN` Rendering 🔴

If the `prices[balance.currency]` feed is temporarily missing or undefined, the multiplication results in `"NaN"` (Not a Number), which leaks directly into the user interface.

#### 23. [23] Unknown Property (`classes.row`)

The code renders `<WalletRow className={classes.row} />` but the `classes` styling object is never imported, defined, or passed in this file.

#### 24. [24] Using Array `index` as a React `Key`

Because this list gets sorted and modified, binding the element `key` to its array `index` fundamentally breaks React's DOM reconciliation cycle, leading to severe UI rendering bugs.

---

- [🔗 View the Original Unmodified Source Code](./src/problem.tsx)
