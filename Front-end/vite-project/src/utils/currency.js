import { useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';

const formatters = new Map();

export const formatCurrency = (amount, currency = 'USD', minimumFractionDigits = 2, maximumFractionDigits = 2) => {
  const key = `${currency}:${minimumFractionDigits}:${maximumFractionDigits}`;
  if (!formatters.has(key)) {
    formatters.set(key, new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }));
  }
  return formatters.get(key).format(Number(amount) || 0);
};

export const useCurrencyFormatter = ({ minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}) => {
  const { preferences } = useSettings();
  const currency = preferences.currency || 'USD';
  return useCallback(
    (amount) => formatCurrency(amount, currency, minimumFractionDigits, maximumFractionDigits),
    [currency, minimumFractionDigits, maximumFractionDigits],
  );
};
