import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TokenSelector from './TokenSelector';
import userEvent from '@testing-library/user-event';

const mockTokens = ['ETH', 'BTC', 'USDT'];

describe('TokenSelector Component', () => {
  it('TC-01: Renders selector correctly', () => {
    render(<TokenSelector label="Select Token" value="ETH" availableTokens={mockTokens} />);
    expect(screen.getByLabelText('Select Token')).toHaveValue('ETH');
  });

  it('TC-02: Calls onChange when a new token is selected', () => {
    const handleChange = vi.fn();
    render(
      <TokenSelector
        label="Token"
        value="ETH"
        onChange={handleChange}
        availableTokens={mockTokens}
      />,
    );

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    fireEvent.click(screen.getByRole('option', { name: 'BTC' }));

    expect(handleChange).toHaveBeenCalledWith('BTC');
  });

  it('TC-03: Does not crash if onChange is undefined', () => {
    render(<TokenSelector label="Token" value="ETH" availableTokens={mockTokens} />);
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByRole('option', { name: 'BTC' })); // Should not crash
  });

  it('TC-03: Disables selector when disabled is true', () => {
    render(<TokenSelector value="ETH" availableTokens={mockTokens} disabled />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('TC-04: Disables selector when availableTokens is empty', () => {
    render(<TokenSelector value="" availableTokens={[]} />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('TC-05: Filters options by typed text (case-insensitive)', async () => {
    const user = userEvent.setup();
    render(<TokenSelector value="ETH" availableTokens={['ATOM', 'STATOM', 'RATOM', 'ETH']} />);

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'atom');

    const options = screen.getAllByRole('option').map((o) => o.textContent);
    expect(options).toEqual(['ATOM', 'STATOM', 'RATOM']);
  });

  it('TC-06: Shows empty message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<TokenSelector value="ETH" availableTokens={mockTokens} />);

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'zzz');

    expect(screen.getByText('No tokens found')).toBeInTheDocument();
  });
});
