export const formatCurrency = (value: number, hideValue: boolean = false): string => {
  if (hideValue) {
    return '••••••';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number, hideValue: boolean = false): string => {
  if (hideValue) {
    return '••••••';
  }
  
  return `${value.toFixed(1)}%`;
};