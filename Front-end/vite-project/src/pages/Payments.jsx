import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { paymentMethods } from '../data/mockData';
import { useTransactions } from '../context/TransactionContext';
import { useCurrencyFormatter } from '../utils/currency';

const Payments = () => {
  const { transactions } = useTransactions();
  const formatCurrency = useCurrencyFormatter();

  const methodsWithTotals = useMemo(() => paymentMethods.map((method) => {
    const totals = transactions.reduce((result, transaction) => {
      if (transaction.paymentMethod !== method.name) return result;

      result.count += 1;
      if (transaction.type === 'expense') result.expenses += Number(transaction.amount);
      if (transaction.type === 'income') result.income += Number(transaction.amount);
      return result;
    }, { count: 0, expenses: 0, income: 0 });

    return { ...method, ...totals };
  }), [transactions]);

  const totals = useMemo(() => methodsWithTotals.reduce((result, method) => ({
    expenses: result.expenses + method.expenses,
    income: result.income + method.income,
  }), { expenses: 0, income: 0 }), [methodsWithTotals]);

  const expenseChartData = useMemo(() => methodsWithTotals
    .filter((method) => method.expenses > 0)
    .map((method) => ({
      ...method,
      value: method.expenses,
      percentage: totals.expenses > 0 ? (method.expenses / totals.expenses) * 100 : 0,
    })), [methodsWithTotals, totals.expenses]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="mx-auto w-full max-w-6xl py-6 lg:py-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Your finances</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Payment Methods</h1>
        <p className="text-sm text-slate-500">See how you spend and receive money across your payment methods.</p>
      </header>

      <section aria-label="All payment methods">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Your payment methods</h2>
            <p className="mt-1 text-sm text-slate-500">Activity across each way you pay and receive money.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <p className="text-slate-500">Total expenses <span className="font-semibold text-slate-900">{formatCurrency(totals.expenses)}</span></p>
            <p className="text-slate-500">Total income <span className="font-semibold text-slate-900">{formatCurrency(totals.income)}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {methodsWithTotals.map((method) => (
            <article
              key={method.id}
              style={{ padding: 24 }}
              className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="min-w-0 truncate text-sm font-semibold text-slate-900">{method.name}</h3>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {method.count} {method.count === 1 ? 'transaction' : 'transactions'}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs font-medium text-slate-500">Total expenses</p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{formatCurrency(method.expenses)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Total income</p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{formatCurrency(method.income)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="expense-chart-title"
        style={{ padding: 24 }}
        className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
      >
        <div className="mb-5">
          <h2 id="expense-chart-title" className="text-lg font-semibold tracking-tight text-slate-900">Expenses by Payment Method</h2>
          <p className="mt-1 text-sm text-slate-500">A breakdown of your spending across payment methods.</p>
        </div>

        {expenseChartData.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center">
            <div>
              <p className="text-sm font-semibold text-slate-700">No expenses to show yet</p>
              <p className="mt-1 text-sm text-slate-500">Expense transactions will appear here once they’re added.</p>
            </div>
          </div>
        ) : (
          <div className="grid min-w-0 items-center gap-6 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
            <div className="relative mx-auto h-[280px] w-full min-w-0 max-w-sm" role="img" aria-label={`Donut chart of ${formatCurrency(totals.expenses)} in expenses by payment method`}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={104}
                    paddingAngle={3}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {expenseChartData.map((method) => <Cell key={method.id} fill={method.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-slate-500">Total expenses</span>
                <span className="mt-1 text-xl font-bold tracking-tight text-slate-900">{formatCurrency(totals.expenses)}</span>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1" aria-label="Expense totals by payment method">
              {expenseChartData.map((method) => (
                <li key={method.id} className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: method.color }} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{method.name}</span>
                  <span className="shrink-0 text-right text-sm font-semibold text-slate-900">{formatCurrency(method.expenses)}</span>
                  <span className="w-14 shrink-0 text-right text-xs text-slate-500">{method.percentage.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default Payments;
