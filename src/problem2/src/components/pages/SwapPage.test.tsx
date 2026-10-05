import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SwapPage from './SwapPage';

// Mock SwapCard so we don't have to provide all its contexts (react-query etc)
vi.mock('@organisms/SwapCard', () => ({
  default: () => <div data-testid="mock-swap-card">Mock SwapCard</div>,
}));

describe('SwapPage', () => {
  it('renders the layout and SwapCard', () => {
    render(<SwapPage />);
    expect(screen.getByTestId('mock-swap-card')).toBeInTheDocument();
  });
});
