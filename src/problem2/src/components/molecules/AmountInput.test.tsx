import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import AmountInput from './AmountInput';

describe('AmountInput Component', () => {
  describe('1. Rendering & Props', () => {
    it('TC-01: Renders input correctly', () => {
      render(<AmountInput label="You Pay" value="" />);
      expect(screen.getByLabelText('You Pay')).toBeInTheDocument();
    });

    it('TC-02: Renders in readOnly mode correctly', () => {
      render(<AmountInput label="Output" value="5000" readOnly />);

      const input = screen.getByLabelText('Output') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
      expect(input.value).toBe('5,000');
    });

    it('TC-03: Disables input when disabled is true', () => {
      render(<AmountInput label="Pay" value="10" disabled />);

      const input = screen.getByLabelText('Pay') as HTMLInputElement;
      expect(input).toBeDisabled();
    });
  });

  describe('2. User Interactions', () => {
    it('TC-04: Updates input value and calls onChange on valid typing', () => {
      const handleChange = vi.fn();
      render(<AmountInput label="Pay" value="" onChange={handleChange} />);

      const input = screen.getByLabelText('Pay') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '100' } });

      expect(input.value).toBe('100');
      expect(handleChange).toHaveBeenCalledWith('100');

      // Test clearing the input
      fireEvent.change(input, { target: { value: '' } });
      expect(input.value).toBe('');
      expect(handleChange).toHaveBeenCalledWith('');
    });
    it('TC-05: Selects all text automatically when input receives focus', async () => {
      vi.useFakeTimers();
      render(<AmountInput label="Pay" value="1000" />);
      const input = screen.getByLabelText('Pay') as HTMLInputElement;
      const selectSpy = vi.spyOn(input, 'select');
      fireEvent.focus(input);
      vi.advanceTimersByTime(20);
      expect(selectSpy).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe('3. Validation & Formatting', () => {
    it('TC-06: Rejects invalid characters (letters, multiple decimals)', () => {
      const handleChange = vi.fn();
      render(<AmountInput label="Pay" value="10" onChange={handleChange} />);

      const input = screen.getByLabelText('Pay') as HTMLInputElement;

      // Typing letters should be rejected immediately
      fireEvent.change(input, { target: { value: '10A' } });
      expect(handleChange).not.toHaveBeenCalled();

      // Typing a second decimal point should be rejected
      fireEvent.change(input, { target: { value: '10.5.' } });
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('TC-07: Prevents manually typing commas but converts trailing comma to decimal dot', () => {
      const handleChange = vi.fn();
      render(<AmountInput label="Pay" value="100" onChange={handleChange} />);

      const input = screen.getByLabelText('Pay') as HTMLInputElement;

      // Typing comma at the end converts to dot
      fireEvent.change(input, { target: { value: '100,' } });
      expect(input.value).toBe('100.');
      expect(handleChange).toHaveBeenCalledWith('100.');

      // Typing consecutive commas is rejected
      fireEvent.change(input, { target: { value: '100.,,' } });
      // The last successful value was '100.', so it shouldn't change
      expect(input.value).toBe('100.');

      // Pasting string with multiple consecutive commas should be rejected entirely
      fireEvent.change(input, { target: { value: '1,,500' } });
      expect(input.value).toBe('100.');
    });

    it('TC-08: Converts trailing comma to dot even if onChange is undefined', () => {
      render(<AmountInput label="Pay" value="100" />);
      const input = screen.getByLabelText('Pay') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '100,' } });
      expect(input.value).toBe('100.');
    });

    it('TC-09: Enforces integer and fractional length limits', () => {
      const handleChange = vi.fn();
      render(<AmountInput label="Pay" value="" onChange={handleChange} />);

      const input = screen.getByLabelText('Pay') as HTMLInputElement;

      // Exceeding 12 integers should be rejected
      fireEvent.change(input, { target: { value: '1234567890123' } });
      expect(handleChange).not.toHaveBeenCalled();

      // Exceeding 6 fractions should be rejected
      fireEvent.change(input, { target: { value: '10.1234567' } });
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('TC-09: Formats number with commas on blur', () => {
      render(<AmountInput label="Pay" value="1000" />);
      const input = screen.getByLabelText('Pay') as HTMLInputElement;

      // Simulate user typing
      fireEvent.change(input, { target: { value: '1000' } });
      expect(input.value).toBe('1000');

      // Simulate blur
      fireEvent.blur(input);
      expect(input.value).toBe('1,000');
    });

    it('TC-10: Does not format on blur if value is empty or invalid', () => {
      render(<AmountInput label="Pay" value="" />);
      const input = screen.getByLabelText('Pay') as HTMLInputElement;
      fireEvent.blur(input);
      expect(input.value).toBe(''); // No error, state remains empty
    });
  });

  describe('4. State Synchronization', () => {
    it('TC-11: Synchronizes internal state when value prop changes externally', () => {
      const { rerender } = render(<AmountInput label="Receive" value="50" />);
      const input = screen.getByLabelText('Receive') as HTMLInputElement;

      // Initially formatted
      expect(input.value).toBe('50');

      // Parent updates amount (e.g. swap calculation result)
      rerender(<AmountInput label="Receive" value="10000" />);

      // Should format immediately
      expect(input.value).toBe('10,000');

      // Parent clears amount externally
      rerender(<AmountInput label="Receive" value="" />);
      expect(input.value).toBe('');
    });

    it('TC-12: Handles standard controlled input loop properly without overwriting display', () => {
      const { rerender } = render(<AmountInput label="Receive" value="50" />);
      const input = screen.getByLabelText('Receive') as HTMLInputElement;

      // User types
      fireEvent.change(input, { target: { value: '100.' } });
      expect(input.value).toBe('100.');

      // Parent echoes the state back
      rerender(<AmountInput label="Receive" value="100." />);
      // It should NOT overwrite "100." with "100" because they parse to the same numeric string
      expect(input.value).toBe('100.');
    });

    it('TC-13: Does not crash if onChange is undefined', () => {
      render(<AmountInput label="Pay" value="" />);
      const input = screen.getByLabelText('Pay') as HTMLInputElement;
      // Valid type without onChange
      fireEvent.change(input, { target: { value: '10' } });
      expect(input.value).toBe('10');

      // Clear input without onChange
      fireEvent.change(input, { target: { value: '' } });
      expect(input.value).toBe('');
    });
  });

  describe('5. Accessibility (a11y)', () => {
    it('TC-14: Complies with WCAG standards', async () => {
      const { container } = render(<AmountInput label="Pay" value="10" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
