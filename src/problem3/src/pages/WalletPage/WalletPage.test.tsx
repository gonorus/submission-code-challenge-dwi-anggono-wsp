import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletPage } from './WalletPage';
import * as useWalletDataHook from '@hooks/useWalletData';

// Mock the hook module
vi.mock('@hooks/useWalletData', () => ({
  useWalletData: vi.fn(),
}));

describe('WalletPage Component', () => {
  it('renders correctly when data is available', () => {
    // Setup the mock return value
    vi.mocked(useWalletDataHook.useWalletData).mockReturnValue({
      balances: [{ currency: 'ETH', amount: 2, blockchain: 'Ethereum' }],
      prices: { ETH: 2000 },
    });

    render(<WalletPage>Test Children</WalletPage>);

    // Since the hook returns data immediately, it should render WalletList (which renders WalletRow with '2')
    expect(screen.getByText(/2/)).toBeInTheDocument();

    // It should also render children
    expect(screen.getByText(/Test Children/)).toBeInTheDocument();
  });
});
