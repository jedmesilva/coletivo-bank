
/**
 * Formats a number as Brazilian Real currency
 * @param value - The number to format
 * @param hideCurrency - If true, returns asterisks instead of the actual value
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, hideCurrency: boolean = false): string => {
  if (hideCurrency) {
    return "R$ ******";
  }
  
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats a number as a percentage
 * @param value - The percentage value
 * @param hideCurrency - If true, returns asterisks instead of the actual value
 * @returns Formatted percentage string with + or - prefix
 */
export const formatPercentage = (value: number, hideCurrency: boolean = false): string => {
  if (hideCurrency) {
    return "***%";
  }
  
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value}%`;
};
