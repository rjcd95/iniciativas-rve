export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(amount);
};

export const calculateProgress = (
  current: number,
  required: number
): number => {
  if (required === 0) return 0;
  return Math.min((current / required) * 100, 100);
};

