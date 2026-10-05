import { useState, ChangeEvent, useMemo, memo } from 'react';
import { TextField } from '@mui/material';
import { formatCurrency, parseCurrency } from '@utils/format';

export interface AmountInputProps {
  label?: string;
  value: string;
  onChange?: (amount: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
}

const AmountInput = memo(function AmountInput({
  label = 'Amount',
  value,
  onChange,
  disabled = false,
  readOnly = false,
  error = false,
  helperText = '',
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(() => formatCurrency(value));
  const [prevValue, setPrevValue] = useState<string>(value);

  // Derived State Pattern: Sync state during render when 'value' prop changes externally
  if (value !== prevValue) {
    setPrevValue(value);
    if (!value) {
      setDisplayValue('');
    } else {
      const currentParsed = parseCurrency(displayValue).replace(/[^\d.]/g, '');
      if (value !== currentParsed) {
        setDisplayValue(formatCurrency(value));
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;

    if (rawVal === '') {
      setDisplayValue('');
      if (onChange) onChange('');
      return;
    }

    // STRICT VALIDATION: Reject any typing that is not a number, comma, or dot
    if (/[^\d.,]/.test(rawVal)) return;

    const prevCleaned = parseCurrency(displayValue).replace(/[^\d.]/g, '');
    let cleaned = parseCurrency(rawVal).replace(/[^\d.]/g, '');

    // Strip invalid leading zeros (e.g., '02' -> '2', '00' -> '0', '00.5' -> '0.5')
    cleaned = cleaned.replace(/^0+(?=\d)/, '');

    // Prevent manually typing useless commas that don't change the numeric value
    if (cleaned === prevCleaned && rawVal.length > displayValue.length) {
      // Smart UX: If user types a comma at the end, assume they want a decimal point (EU/ID locale)
      if (rawVal.endsWith(',') && !cleaned.includes('.')) {
        const newVal = rawVal.slice(0, -1) + '.';
        setDisplayValue(newVal);
        if (onChange) onChange(cleaned + '.');
      }
      return;
    }

    // Reject pasting multiple consecutive commas
    if (/,{2,}/.test(rawVal)) return;

    // Validate structure: Only one decimal point allowed
    const parts = cleaned.split('.');
    if (parts.length > 2) return;

    // Validate length: Max 12 integer digits, Max 6 fractional digits
    if (parts[0] && parts[0].length > 12) return;
    if (parts[1] && parts[1].length > 6) return;

    setDisplayValue(rawVal);
    if (onChange) {
      onChange(cleaned);
    }
  };

  const handleBlur = () => {
    if (value && !isNaN(Number(value))) {
      setDisplayValue(formatCurrency(value));
    }
  };

  const formattedReadOnlyValue = useMemo(() => formatCurrency(value), [value]);

  return (
    <TextField
      id={`${label.replace(/\s+/g, '-')}-input`}
      label={label}
      value={readOnly ? formattedReadOnlyValue : displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      error={error}
      helperText={helperText}
      slotProps={{
        input: {
          readOnly: readOnly,
        },
        htmlInput: {
          inputMode: 'decimal',
          readOnly: readOnly,
          onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
            const target = e.target;
            // Defer selection slightly so the browser's mouseup event doesn't clear it
            setTimeout(() => {
              target.select();
            }, 10);
          },
        },
      }}
      fullWidth
      variant="outlined"
    />
  );
});

export default AmountInput;
