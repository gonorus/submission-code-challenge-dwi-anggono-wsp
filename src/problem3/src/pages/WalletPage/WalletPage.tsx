// Solution for [3]: Correctly imported all necessary dependencies and components.
import { Suspense } from 'react';
import { useWalletData } from '@hooks/useWalletData';
import { useFormattedWallet } from '@hooks/useFormattedWallet';
import { WalletList } from '@organisms/WalletList';
import { PageLayout, BoxProps } from '@templates/PageLayout';

const WalletPageContent = ({ children, ...rest }: BoxProps) => {
  // This hook will suspend the render until data is ready
  const { balances, prices } = useWalletData();

  const formattedBalances = useFormattedWallet(balances);

  return (
    <PageLayout {...rest}>
      <WalletList balances={formattedBalances} prices={prices} />
      {/* Solution for [5]: Properly rendered 'children' prop inside the layout tree. */}
      {children}
    </PageLayout>
  );
};

// Solution for [1] & [2]: Removed redundant React.FC and empty interfaces; using BoxProps directly.
export const WalletPage = (props: BoxProps) => {
  return (
    // ErrorBoundary is recommended to catch Suspense rejects (e.g. via react-error-boundary)
    <Suspense fallback={<PageLayout {...props}>Loading wallet data...</PageLayout>}>
      <WalletPageContent {...props} />
    </Suspense>
  );
};
