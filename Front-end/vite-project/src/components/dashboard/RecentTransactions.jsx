import { useMemo } from 'react';

// ── Currency formatter ─────────────────────────────────────────────────────
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

// ── Date formatter ─────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// ── Main component ─────────────────────────────────────────────────────────
const RecentTransactions = ({ transactions }) => {
  // ── Get latest 6 transactions sorted by date ──────────────────────────
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [transactions]);

  // ── Empty state ────────────────────────────────────────────────────────
  if (recentTransactions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Your latest financial activity
          </p>
        </div>
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">
            <p className="text-[14px] text-slate-400">
              No transactions found for the selected filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render transactions ────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Your latest financial activity
        </p>
      </div>

      {/* Transactions list */}
      <div className="divide-y divide-slate-100">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="px-8 py-5 hover:bg-slate-50 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-6">
              {/* Left: Icon + Content */}
              <div className="flex gap-4 flex-1 min-w-0">
                {/* Icon circle */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    transaction.type === 'income'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  <span className="text-lg font-bold">
                    {transaction.type === 'income' ? '↓' : '↑'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1 truncate">
                    {transaction.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {transaction.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                  <div className="mt-1 text-[12px] text-slate-400">
                    {transaction.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Right: Amount */}
              <div className="shrink-0 text-right">
                {transaction.type === 'income' ? (
                  <div className="text-[16px] font-bold text-emerald-600">
                    +{formatCurrency(transaction.amount)}
                  </div>
                ) : (
                  <div className="text-[16px] font-bold text-rose-600">
                    -{formatCurrency(transaction.amount)}
                  </div>
                )}
                <div className="mt-0.5 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                  {transaction.type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
