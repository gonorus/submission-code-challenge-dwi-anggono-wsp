import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { useState, ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { axe } from 'jest-axe';
import SwapCard from './SwapCard';

function Wrapper({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const render = (ui: ReactElement) => rtlRender(ui, { wrapper: Wrapper });

describe('SwapCard Component', () => {
  beforeEach(() => {
    // Default successful mock for most tests
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { currency: 'BLUR', price: 0.2 },
            { currency: 'ETH', price: 1600 },
            { currency: 'USDC', price: 1 },
          ]),
      }),
    ) as any;
  });

  describe('1. Rendering & API Mocking', () => {
    it('TC-01: Renders loading state initially', async () => {
      let resolveFetch: any;
      global.fetch = vi.fn(() => {
        return new Promise((resolve) => {
          resolveFetch = resolve;
        });
      }) as any;

      render(<SwapCard />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      resolveFetch({
        json: () => Promise.resolve([]),
      });
    });

    it('TC-02: Renders form and sets default states after successful fetch', async () => {
      render(<SwapCard />);

      // Wait for fetch to finish and form to appear (progressbar disappears)
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Quick Swap')).toBeInTheDocument();

      // Default amount is "0"
      const payInput = screen.getByLabelText('You Pay') as HTMLInputElement;
      expect(payInput.value).toBe('0');

      // Tokens should auto-select the first and second available tokens (BLUR, ETH)
      const payTokenSelect = screen.getByLabelText('Pay Token');
      const receiveTokenSelect = screen.getByLabelText('Receive Token');
      expect(payTokenSelect).toHaveValue('BLUR');
      expect(receiveTokenSelect).toHaveValue('ETH');

      // Submit button should be disabled with text "Enter an amount"
      const submitButton = screen.getByRole('button', { name: 'Enter an amount' });
      expect(submitButton).toBeDisabled();
    });

    it('TC-03: Handles API error gracefully', async () => {
      global.fetch = vi.fn(() => Promise.reject('API Down')) as any;
      render(<SwapCard />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Quick Swap')).toBeInTheDocument();
    });
  });

  describe('2. State & Mathematical Calculations', () => {
    it('TC-04: Computes exchange output correctly based on prices', async () => {
      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const payInput = screen.getByLabelText('You Pay') as HTMLInputElement;
      fireEvent.change(payInput, { target: { value: '100' } });

      // BLUR is $0.2, ETH is $1600.
      // 100 BLUR = $20.
      // 20 / 1600 = 0.0125 ETH
      const receiveInput = screen.getByLabelText('You Receive') as HTMLInputElement;
      expect(receiveInput.value).toBe('0.0125');
    });

    it('TC-05: Swaps currencies when swap button is clicked', async () => {
      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const swapButton = screen.getByLabelText('Swap currencies');
      fireEvent.click(swapButton);

      // Now pay should be ETH and receive should be BLUR
      const payTokenSelect = screen.getByLabelText('Pay Token');
      const receiveTokenSelect = screen.getByLabelText('Receive Token');
      expect(payTokenSelect).toHaveValue('ETH');
      expect(receiveTokenSelect).toHaveValue('BLUR');
    });

    it('TC-10: Shows 0.000000 if amount is typed but tokens are not selected (or prices missing)', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve([{ currency: 'XYZ', price: undefined }]),
        }),
      ) as any;

      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const payInput = screen.getByLabelText('You Pay') as HTMLInputElement;
      fireEvent.change(payInput, { target: { value: '10' } });

      const receiveInput = screen.getByLabelText('You Receive') as HTMLInputElement;
      expect(receiveInput.value).toBe('0');
    });
  });

  describe('3. Form Validation & Submissions', () => {
    it('TC-07: Disables submit button when form is invalid', async () => {
      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Valid form
      const payInput = screen.getByLabelText('You Pay') as HTMLInputElement;
      fireEvent.change(payInput, { target: { value: '100' } });
      expect(screen.getByRole('button', { name: 'Swap' })).not.toBeDisabled();

      // Invalid amount
      fireEvent.change(payInput, { target: { value: '0' } });
      expect(screen.getByRole('button', { name: 'Enter an amount' })).toBeDisabled();
    });

    it('TC-08: Shows loading spinner on submit and success message afterwards', async () => {
      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const payInput = screen.getByLabelText('You Pay') as HTMLInputElement;
      fireEvent.change(payInput, { target: { value: '100' } });

      const submitButton = screen.getByRole('button', { name: 'Swap' });
      fireEvent.click(submitButton);

      // Swapping animation state
      expect(screen.getByText('Swapping...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Wait for success screen
      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toHaveTextContent('Swap successful');
        },
        { timeout: 3000 },
      );

      // Click done to go back to idle
      const doneButton = screen.getByRole('button', { name: 'Confirm' });
      fireEvent.click(doneButton);

      expect(screen.getByText('Quick Swap')).toBeInTheDocument();
    });
  });

  describe('4. Accessibility (a11y)', () => {
    it('TC-09: Complies with WCAG standards', async () => {
      const { container } = render(<SwapCard />);
      // Wait for fetch
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('5. Defensive Programming & Edge Cases', () => {
    it('TC-11: Ignores tokens without a valid price from the API', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { currency: 'OK_TOKEN', price: 100 },
              { currency: 'BAD_TOKEN', price: undefined },
            ]),
        }),
      ) as any;

      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      fireEvent.mouseDown(selects[0]);

      expect(screen.getByRole('option', { name: 'OK_TOKEN' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'BAD_TOKEN' })).not.toBeInTheDocument();
    });

    it('TC-12: Returns empty output if amount is an invalid number (NaN)', async () => {
      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const payInput = screen.getByLabelText('You Pay') as HTMLInputElement;
      fireEvent.change(payInput, { target: { value: '.' } });

      const receiveInput = screen.getByLabelText('You Receive') as HTMLInputElement;
      expect(receiveInput.value).toBe('');
    });

    it('TC-13: Prevents swap execution when form is forcefully submitted while invalid', async () => {
      render(<SwapCard />);
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const payInput = screen.getByLabelText('You Pay') as HTMLInputElement;

      // Submit the form while it's invalid (amount is 0)
      fireEvent.submit(payInput);

      // Should not transition to 'swapping' state
      const submitButton = screen.getByRole('button', { name: 'Enter an amount' });
      expect(submitButton).toBeInTheDocument();
      expect(screen.queryByText('Swapping...')).not.toBeInTheDocument();
    });
  });
});
