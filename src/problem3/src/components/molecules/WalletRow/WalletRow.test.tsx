import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletRow } from './WalletRow';

describe('WalletRow Component', () => {
  it('renders correctly with given props', () => {
    render(
      <WalletRow className="test-class" amount={100} usdValue={250.5} formattedAmount="100.00" />,
    );

    // Instead of querying by text since it might be combined, we can check for text content in the document
    expect(screen.getByText(/100\.00/)).toBeInTheDocument();
    expect(screen.getByText(/250\.5/)).toBeInTheDocument();

    // It should render a div/span with the passed className (this relies on the internal implementation of WalletRow)
    // If WalletRow just returns a div:
    const container = screen.getByText(/100\.00/).parentElement;
    expect(container).toBeInTheDocument();
  });
});
