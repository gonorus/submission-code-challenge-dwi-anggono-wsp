import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SwapProgress from './SwapProgress';

describe('SwapProgress', () => {
  it('renders progress UI with correct amounts and tokens', () => {
    render(<SwapProgress payAmount="10" payToken="USDC" receiveAmount="9.9" receiveToken="BUSD" />);

    expect(screen.getByText('Swapping...')).toBeInTheDocument();
    expect(screen.getByText('10 USDC → 9.9 BUSD')).toBeInTheDocument();
  });
});
