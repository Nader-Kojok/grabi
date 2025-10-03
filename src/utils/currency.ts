/**
 * Format a number as F CFA currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, options: { compact?: boolean } = {}): string => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: options.compact ? 'compact' : 'standard',
  });

  return `${formatter.format(amount)} F CFA`;
};

/**
 * Parse a currency string into a number
 * @param value - The currency string to parse
 * @returns Parsed number or null if invalid
 */
export const parseCurrency = (value: string): number | null => {
  const cleanValue = value.replace(/[^\d]/g, '');
  const number = parseInt(cleanValue, 10);
  return isNaN(number) ? null : number;
};
