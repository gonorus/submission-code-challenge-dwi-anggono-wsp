import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import TokenIcon, { TokenIconSkeleton } from './TokenIcon';

describe('TokenIcon', () => {
  it('TC-01: [Component] Renders TokenIconSkeleton standalone', () => {
    const { container } = render(<TokenIconSkeleton size={40} />);

    // Check main Avatar root style and Skeleton element
    const avatarRoot = container.firstChild as HTMLElement;
    expect(avatarRoot).toHaveStyle({ width: '40px', height: '40px' });
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
  });

  it('TC-02: [Lifecycle] Renders Skeleton initially while loading (Loading State)', () => {
    const { container } = render(<TokenIcon symbol="ETH" />);

    // Skeleton should be visible
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();

    // Image should be hidden with display: none
    const avatarImg = screen.getByRole('img', { hidden: true });
    expect(avatarImg).toHaveStyle({ display: 'none' });
  });

  it('TC-03: [Lifecycle] Displays image and hides Skeleton after successful load (Success State)', () => {
    const { container } = render(<TokenIcon symbol="ETH" />);
    const avatarImg = screen.getByRole('img', { hidden: true });

    // Simulate successful image load
    fireEvent.load(avatarImg);

    // Skeleton should disappear
    expect(container.querySelector('.MuiSkeleton-root')).not.toBeInTheDocument();

    // Image should be visible (display: block)
    expect(avatarImg).toHaveStyle({ display: 'block' });
  });

  it('TC-04: [Lifecycle] Falls back to initial character on image error (Error State)', () => {
    const { container } = render(<TokenIcon symbol="UNKNOWN" />);
    const avatarImg = screen.getByRole('img', { hidden: true });

    // Simulate image failing to load
    fireEvent.error(avatarImg);

    // Skeleton should disappear
    expect(container.querySelector('.MuiSkeleton-root')).not.toBeInTheDocument();

    // The fallback text inside the Avatar should render the first letter "U"
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('TC-05: [State] Resets error and loading state on symbol prop change', () => {
    const { container, rerender } = render(<TokenIcon symbol="ETH" />);

    // Trigger error on initial render
    fireEvent.error(screen.getByRole('img', { hidden: true }));
    expect(screen.getByText('E')).toBeInTheDocument(); // Error fallback text shown

    // Rerender with a new symbol
    rerender(<TokenIcon symbol="BTC" />);

    // Should reset to loading state with a new skeleton and hidden image
    expect(screen.queryByText('E')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toHaveStyle({ display: 'none' });
  });

  it('TC-06: [Edge Case] Ignores stale image events / Race Condition', () => {
    const { rerender } = render(<TokenIcon symbol="ETH" />);
    const ethImg = screen.getByRole('img', { hidden: true }); // Capture the old img element closure

    // Rerender with new symbol
    rerender(<TokenIcon symbol="BTC" />);
    const btcImg = screen.getByRole('img', { hidden: true });

    // Simulate delayed successful load from the first 'ETH' request
    fireEvent.load(ethImg);

    // Simulate delayed error from the first 'ETH' request on the DOM
    fireEvent.error(ethImg);

    // The state should NOT be corrupted! BTC should still be in loading state, no fallback 'B' or 'E'
    expect(screen.queryByText('E')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();

    // Simulate successful load for the new 'BTC' request
    fireEvent.load(btcImg);
    expect(btcImg).toHaveStyle({ display: 'block' });
  });

  it('TC-07: [Edge Case] Handles empty symbol safely', () => {
    const { container } = render(<TokenIcon symbol="" />);

    // Should immediately render '?', no skeleton, no img
    expect(screen.getByText('?')).toBeInTheDocument();
    expect(container.querySelector('.MuiSkeleton-root')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('TC-08: [Style] Applies custom size proportionally', () => {
    const { container } = render(<TokenIcon symbol="BTC" size={40} />);

    // Check main Avatar root style
    const avatarRoot = container.firstChild as HTMLElement;
    expect(avatarRoot).toHaveStyle({
      width: '40px',
      height: '40px',
    });
  });

  it('TC-09: [Accessibility] Complies with WCAG web accessibility standards', async () => {
    const { container } = render(<TokenIcon symbol="ETH" />);
    const results = await axe(container);

    // Check WCAG compliance
    expect(results).toHaveNoViolations();
  });
});
