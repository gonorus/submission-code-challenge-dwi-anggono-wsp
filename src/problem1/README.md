# Problem 1: Three Ways to Sum to N (JavaScript)

Hi there! In this directory, I've put together three different approaches to solve the `sum_to_n(n)` function in vanilla JavaScript. I wanted to explore the trade-offs between different techniques, so I split them into their own separate files.

## A Few Assumptions I Made

Before diving into the code, I want to clarify a few constraints and assumptions I kept in mind while building this:

- **Input Validation (Guard Clause):** Since this is pure JavaScript (without static type checking), I added a strict runtime guard (`!Number.isInteger(n)`) at the beginning of each function. If anyone passes a string, float, null, or boolean, it safely throws a `TypeError`. The resulting sum will also stay within JavaScript's safe integer limit (`Number.MAX_SAFE_INTEGER`, which is `9,007,199,254,740,991`).
- **Handling negative numbers:** If someone passes a negative number like `sum_to_n(-3)`, I decided the function should calculate it symmetrically towards zero (`-1 + -2 + -3 === -6`). Naturally, `sum_to_n(0)` returns `0`.
- **Precision limits:** JavaScript can lose precision if intermediate calculations get too large. To be thorough, I tested the Gauss and iterative methods and confirmed they remain perfectly accurate up to `n = 94,906,264`.

## How I Approached the Implementations

Here is a quick overview of the three methods I built and how they perform:

| File                                                                   | Approach                    | Time     | Space (Call Stack) |
| ---------------------------------------------------------------------- | --------------------------- | -------- | ------------------ |
| [`sumToNIterativeLoop.js`](./src/sumToNIterativeLoop.js)               | Iterative loop              | O(\|n\|) | O(1)               |
| [`sumToNGaussFormula.js`](./src/sumToNGaussFormula.js)                 | Closed-form (Gauss) formula | O(1)     | O(1)               |
| [`sumToNTrampolinedRecursion.js`](./src/sumToNTrampolinedRecursion.js) | Recursion with trampolining | O(\|n\|) | O(1)               |

### 1. The Iterative Loop

I used a straightforward `for` or `while` loop here.

- **Time Complexity - $O(|n|)$**: The loop runs exactly $|n|$ times.
- **Space Complexity - $O(1)$**: This is highly memory-efficient because it just updates a local counter variable. No extra memory is consumed as `n` grows.

### 2. The Gauss Formula

This is the pure mathematical approach using `n * (n + 1) / 2`.

- **Time Complexity - $O(1)$**: It's incredibly fast! Whether you ask for $n=10$ or $n=1,000,000$, it takes the exact same amount of time because it only does one basic math calculation.
- **Space Complexity - $O(1)$**: No loops or recursive calls, just instant calculation.

### 3. Trampolined Recursion

I wanted to include a recursive approach, but simple recursion (`n + f(n-1)`) is dangerous—it stacks every function call in memory, resulting in $O(|n|)$ space complexity. If you pass a large `n`, it will crash your app with a `Maximum call stack size exceeded` error.
To fix this, I implemented a technique called **Trampolining**:

- **Time Complexity - $O(|n|)$**: It scales linearly. However, due to the overhead of creating new function closures (thunks) at every single step, this ends up being the slowest method in practice.
- **Space Complexity - $O(1)$**: This is the magic part! Instead of the function calling itself directly, it returns a deferred function (`return () => ...`). A tiny `while` loop (the trampoline) executes these one by one. This keeps the call stack completely flat, meaning it won't crash no matter how high `n` gets.

## Running the Code Locally

If you'd like to try it out or run my tests, I've set everything up with a modern JavaScript environment using Vitest.

```bash
npm install
npm test          # Run my unit tests via Vitest
npm run bench     # Check out the speed benchmark
npm run lint      # Check code quality (ESLint)
npm run format    # Auto-format everything (Prettier)
```

## How I Tested It

I wrote a robust test suite in [`sumToN.test.js`](./src/sumToN.test.js) that tests all three functions simultaneously. I made sure to cover:

- Positive, zero, and negative inputs.
- Symmetry behavior (verifying `f(-n) === -f(n)`).
- Strict equivalence (making sure all three methods return the exact same answers from -200 to 200).
- Massive inputs like `1,000,000` to prove that the trampolined recursion won't blow up the call stack.
- Precision threshold testing (`94,906,264`) for the Gauss and loop methods.
- Input validation (ensuring invalid inputs like strings, null, and floats successfully throw `TypeError`).

## Benchmark Results

I also set up a benchmark to compare their speeds. You can run it yourself using `npm run bench` ([`sumToN.bench.js`](./src/sumToN.bench.js)).
Here are the operations per second (ops/s) I got on my machine. Higher is better!

| n         | Iterative loop | Gauss formula | Trampolined recursion |
| --------- | -------------: | ------------: | --------------------: |
| 10        |     20,081,219 |    21,973,050 |             9,803,033 |
| 1,000     |      2,787,595 |    20,208,263 |               171,690 |
| 100,000   |          9,858 |    19,758,262 |                 1,367 |
| 1,000,000 |          1,731 |    19,789,422 |                   138 |

> **A quick note on benchmarking**: Vitest warns that there is a slight overhead when testing exported functions like this. This just means the absolute numbers above might be slightly lower than reality, but the speed differences between the three methods remain accurate!
