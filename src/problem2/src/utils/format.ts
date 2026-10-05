/**
 * Utility: Format a clean number string into a localized string with commas.
 * Uses en-US locale for consistent comma thousands-separator and dot decimal-separator.
 */
export const formatCurrency = (val: string | number): string => {
  if (val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(num);
};

/**
 * Utility: Strip commas to get raw numeric string for calculations or parsing.
 */
export const parseCurrency = (val: string): string => val.replace(/,/g, '');
