import { createContext, useContext, useEffect, useState } from 'react';
import { transactions as initialTransactions } from '../data/mockData';

const TransactionContext = createContext(null);
const STORAGE_KEY = 'spendly_transactions';

const loadTransactions = () => {
  try {
    const savedTransactions = window.localStorage.getItem(STORAGE_KEY);
    if (savedTransactions === null) return [...initialTransactions];

    const parsedTransactions = JSON.parse(savedTransactions);
    return Array.isArray(parsedTransactions) ? parsedTransactions : [...initialTransactions];
  } catch {
    return [...initialTransactions];
  }
};

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(loadTransactions);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      // Storage can be unavailable or full; keep the in-memory state usable.
    }
  }, [transactions]);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

// This hook intentionally shares the provider context from this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactions must be used within a TransactionProvider');
  return context;
}
