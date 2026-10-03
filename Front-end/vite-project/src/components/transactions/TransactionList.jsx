import { HiOutlineArrowDownLeft, HiOutlineArrowUpRight, HiOutlineReceiptPercent } from 'react-icons/hi2';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(value);

const formatDate = (dateStr) => new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
});

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center px-6 py-14 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><HiOutlineReceiptPercent className="h-6 w-6" /></span>
        <p className="mt-4 text-sm font-semibold text-slate-900">No transactions found</p>
        <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50/80">
            <tr>
              {['Transaction', 'Category', 'Payment method', 'Date', 'Amount'].map((heading) => (
                <th key={heading} scope="col" style={{ padding: '14px 24px', ...(heading === 'Amount' ? { paddingRight: 32, textAlign: 'right' } : {}) }} className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 ${heading === 'Amount' ? 'text-right' : ''}`}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const Icon = isIncome ? HiOutlineArrowDownLeft : HiOutlineArrowUpRight;
              return (
                <tr key={transaction.id} className="group border-b border-slate-200/10 transition-colors last:border-b-0 hover:bg-slate-50/70">
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center gap-4">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}><Icon className="h-5 w-5" /></span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{transaction.title}</p>
                        <p className="mt-1 text-xs capitalize text-slate-400">{transaction.type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}><span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{transaction.category}</span></td>
                  <td style={{ padding: '16px 24px' }} className="whitespace-nowrap text-sm text-slate-500">{transaction.paymentMethod}</td>
                  <td style={{ padding: '16px 24px' }} className="whitespace-nowrap text-sm text-slate-500">{formatDate(transaction.date)}</td>
                  <td style={{ padding: '16px 32px 16px 24px' }} className="whitespace-nowrap text-right">
                    <span className={`text-sm font-bold tabular-nums ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>{isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'income';
          const Icon = isIncome ? HiOutlineArrowDownLeft : HiOutlineArrowUpRight;
          return (
            <article key={transaction.id} style={{ padding: '16px 12px' }} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}><Icon className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{transaction.title}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{transaction.category} <span className="px-1 text-slate-300">·</span> {formatDate(transaction.date)}</p>
                </div>
              </div>
              <p className={`shrink-0 text-sm font-bold tabular-nums ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>{isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}</p>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default TransactionList;
