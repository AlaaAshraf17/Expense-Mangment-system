import { useMemo } from 'react';
import { categories } from '../data/mockData';
import { useTransactions } from '../context/TransactionContext';
import { useCurrencyFormatter } from '../utils/currency';

const Categories = () => {
  const { transactions } = useTransactions();
  const formatCurrency = useCurrencyFormatter();

  const expenseCategories = useMemo(() => {
    const totalsByCategory = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((totals, transaction) => {
        if (!totals[transaction.category]) {
          totals[transaction.category] = { total: 0, count: 0 };
        }

        totals[transaction.category].total += Number(transaction.amount);
        totals[transaction.category].count += 1;
        return totals;
      }, {});

    return categories
      .filter((category) => category.type === 'expense')
      .map((category) => ({
        ...category,
        total: totalsByCategory[category.name]?.total ?? 0,
        count: totalsByCategory[category.name]?.count ?? 0,
      }));
  }, [transactions]);

  const totalSpent = expenseCategories.reduce((sum, category) => sum + category.total, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="mx-auto w-full max-w-6xl py-6 lg:py-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Your finances</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Categories</h1>
        <p className="text-sm text-slate-500">Understand where your money goes with a clear view of spending by category.</p>
      </header>

      <section aria-label="Expense categories">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Your spending categories</h2>
            <p className="mt-1 text-sm text-slate-500">Totals are based on your expense transactions.</p>
          </div>
          <p className="text-sm text-slate-500">
            Total spent <span className="font-semibold text-slate-900">{formatCurrency(totalSpent)}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {expenseCategories.map((category) => (
            <article
              key={category.id}
              style={{ padding: 24 }}
              className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <h3 className="truncate text-sm font-semibold text-slate-900">{category.name}</h3>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {category.count} {category.count === 1 ? 'transaction' : 'transactions'}
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs font-medium text-slate-500">Total spent</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(category.total)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Categories;
