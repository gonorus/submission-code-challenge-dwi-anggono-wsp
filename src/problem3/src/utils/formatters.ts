// Solution for [20]: Replaced .toFixed() with Intl.NumberFormat to prevent arbitrary decimal truncation.
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(amount);
};
