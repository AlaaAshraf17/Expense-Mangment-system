import { HiOutlineArrowDownLeft, HiOutlineArrowUpRight, HiOutlineReceiptPercent } from 'react-icons/hi2';
import { useCurrencyFormatter } from '../../utils/currency';

const formatDate = (dateStr) => new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
});

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const formatCurrency = useCurrencyFormatter();
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
      <div className="mb-3 hidden items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs font-medium text-indigo-700 md:flex">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0"><path d="M3 10h14m0 0-4-4m4 4-4 4M3 10l4-4m-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>Scroll right in the table to find Edit and Delete.</span>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50/80">
            <tr>
              {['Transaction', 'Category', 'Payment method', 'Date', 'Amount', 'Actions'].map((heading) => (
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
                  <td style={{ padding: '16px 24px' }} className="whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => onEdit(transaction)} aria-label={`Edit ${transaction.title}`} className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/15">
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="m13.5 3.5 3 3M4 16l3.2-.7L16 6.5a2.12 2.12 0 0 0-3-3L4.2 12.3 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Edit
                      </button>
                      <button type="button" onClick={() => onDelete(transaction)} aria-label={`Delete ${transaction.title}`} className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-500/15">
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M4.5 6h11m-9.5 0 .6 10h6.8l.6-10M8 6V4h4v2m-3 3v4m2-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Delete
                      </button>
                    </div>
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
              <div className="shrink-0 text-right">
                <p className={`text-sm font-bold tabular-nums ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>{isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}</p>
                <div className="mt-1 flex justify-end gap-1">
                  <button type="button" onClick={() => onEdit(transaction)} aria-label={`Edit ${transaction.title}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5"><path d="m13.5 3.5 3 3M4 16l3.2-.7L16 6.5a2.12 2.12 0 0 0-3-3L4.2 12.3 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Edit
                  </button>
                  <button type="button" onClick={() => onDelete(transaction)} aria-label={`Delete ${transaction.title}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30">
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5"><path d="M4.5 6h11m-9.5 0 .6 10h6.8l.6-10M8 6V4h4v2m-3 3v4m2-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default TransactionList;
