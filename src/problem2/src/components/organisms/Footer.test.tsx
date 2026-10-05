import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders demo build warning', () => {
    render(<Footer />);
    expect(screen.getByText(/Demo build — balances are simulated/i)).toBeInTheDocument();
  });

  it('renders link to switcheo prices', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /interview\.switcheo\.com/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://interview.switcheo.com/prices.json');
  });
});
