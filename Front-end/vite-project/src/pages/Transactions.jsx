import { useState, useMemo } from 'react';
import { transactions } from '../data/mockData';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';

// Updated UI - forced reload
const Transactions = () => {
  // ── Filter state ──────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: '',
    paymentMethod: '',
    datePreset: 'all',
    startDate: '',
    endDate: '',
  });

  // ── Filter and sort transactions ──────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower) ||
          t.paymentMethod.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category filter
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    // Payment method filter
    if (filters.paymentMethod) {
      result = result.filter((t) => t.paymentMethod === filters.paymentMethod);
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      result = result.filter(
        (t) => t.date >= filters.startDate && t.date <= filters.endDate
      );
    }

    // Sort by date, newest first
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    return result;
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
        <p className="mt-1 text-[14px] text-slate-400">
          View and track all your financial activity
        </p>
      </div>

      {/* Filters */}
      <TransactionFilters filters={filters} onFiltersChange={setFilters} />

      {/* Results count */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-3.5">
        <p className="text-[13.5px] font-medium text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredTransactions.length}</span> transaction
          {filteredTransactions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Transaction list */}
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
};

export default Transactions;

