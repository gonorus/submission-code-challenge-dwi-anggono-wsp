// @ts-nocheck
// Numbered markers [1]-[24] correspond to the findings in Analysis.md.

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// [1] Empty Interface Extension
interface Props extends BoxProps {}
// [2] Redundant `React.FC` Declaration
// [3] Missing Imports & Declarations
// [4] Re-declaration of Functions per Render
const WalletPage: React.FC<Props> = (props: Props) => {
  // [5] Discarded `children` Prop
  const { children, ...rest } = props;
  // [6] Missing Loading & Error States
  const balances = useWalletBalances();
  const prices = usePrices();

  // [7] Bypassing Type Safety with `any`
  const getPriority = (blockchain: any): number => {
    // [8] Inefficient Linear Switch Case
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  // [9] Toxic `useMemo` Dependency Array
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // [10] Interface Missing `blockchain` Property
        const balancePriority = getPriority(balance.blockchain);
        // [11] Undeclared `lhsPriority` Variable (Fatal Crash)
        if (lhsPriority > -99) {
          // [12] Inverted Filter Logic
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
        // [13] Redundant Array Iterations
        // [14] In-Place Array Mutation (`.sort()`)
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // [15] Excessive `getPriority` Calls (O(N log N))
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // [16] Standard-Violating Sort Comparator
        // [17] Non-Deterministic Tie-Breaker
      });
  }, [balances, prices]);

  // [18] Array Instantiation Outside `useMemo`
  // [19] Wasted `formattedBalances` Array 🔴
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      // [20] Decimal Truncation via `.toFixed()` 🔴
      formatted: balance.amount.toFixed(),
    };
  });

  // [21] Unsound Type Assertion 🔴
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    // [22] Dangerous `NaN` Rendering 🔴
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        // [23] Unknown Property (`classes.row`)
        className={classes.row}
        // [24] Using Array `index` as a React `Key`
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
