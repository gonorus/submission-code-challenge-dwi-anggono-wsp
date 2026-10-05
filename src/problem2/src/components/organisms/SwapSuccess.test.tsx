import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SwapSuccess from './SwapSuccess';

describe('SwapSuccess', () => {
  it('renders success message and calls onConfirm on click', () => {
    const handleConfirm = vi.fn();
    render(<SwapSuccess onConfirm={handleConfirm} />);

    expect(screen.getByText('Swap successful')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /confirm/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
