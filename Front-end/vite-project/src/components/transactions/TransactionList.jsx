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

const TransactionList = ({ transactions }) => {
  // ── Empty state ────────────────────────────────────────────────────────
  if (transactions.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <p className="text-[15px] font-medium text-slate-900">No transactions found</p>
        <p className="mt-1 text-[13px] text-slate-500">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                Date
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                Category
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                Type
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-[13px] font-medium text-slate-600 whitespace-nowrap">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-[14px] font-semibold text-slate-900">
                    {transaction.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-700">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] font-medium text-slate-600 whitespace-nowrap">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      transaction.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <span
                    className={`text-[15px] font-bold ${
                      transaction.type === 'income'
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="lg:hidden divide-y divide-slate-100">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-slate-900 truncate mb-1">
                  {transaction.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
                  <span className="font-medium">{formatDate(transaction.date)}</span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {transaction.category}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div
                  className={`text-[16px] font-bold mb-1 ${
                    transaction.type === 'income'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    transaction.type === 'income'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {transaction.type}
                </span>
              </div>
            </div>
            <div className="text-[12px] font-medium text-slate-400">
              {transaction.paymentMethod}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
