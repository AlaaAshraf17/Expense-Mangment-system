import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ── Date formatter for x-axis display ─────────────────────────────────────
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

// ── Currency formatter ─────────────────────────────────────────────────────
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

// ── Custom tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
      <p className="text-[12px] font-medium text-slate-600 mb-1.5">{formatDate(label)}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[12px] text-slate-600">{entry.name}:</span>
          </div>
          <span className="text-[13px] font-bold" style={{ color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const IncomeVsExpenses = ({ transactions }) => {
  // ── Transform filtered transactions into chart data ──────────────────────
  const chartData = useMemo(() => {
    // If no transactions, return empty array
    if (transactions.length === 0) return [];

    // Group by date and sum income/expenses
    const grouped = transactions.reduce((acc, t) => {
      const date = t.date;
      if (!acc[date]) {
        acc[date] = { income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        acc[date].income += t.amount;
      } else {
        acc[date].expenses += t.amount;
      }
      return acc;
    }, {});

    // Convert to array format and sort by date
    const data = Object.entries(grouped)
      .map(([date, amounts]) => ({
        date,
        income: amounts.income,
        expenses: amounts.expenses,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return data;
  }, [transactions]);

  // ── Empty state ────────────────────────────────────────────────────────
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Income vs Expenses</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Compare your income and spending over time
          </p>
        </div>
        <div className="flex h-80 items-center justify-center">
          <div className="text-center">
            <p className="text-[14px] text-slate-400">
              No financial activity found for the selected filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Chart render ───────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Income vs Expenses</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Compare your income and spending over time
        </p>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={formatCurrency}
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}
              iconType="circle"
            />

            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ fill: '#f43f5e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeVsExpenses;
