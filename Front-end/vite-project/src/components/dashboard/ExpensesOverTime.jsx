import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

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
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-[12px] font-medium text-slate-600">{formatDate(label)}</p>
      <p className="text-[15px] font-bold text-rose-600">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const ExpensesOverTime = ({ transactions }) => {
  // ── Transform filtered transactions into chart data ──────────────────────
  // Group expense transactions by date and sum amounts for each date
  const chartData = useMemo(() => {
    // Filter only expense transactions
    const expenses = transactions.filter((t) => t.type === 'expense');

    // If no expenses, return empty array
    if (expenses.length === 0) return [];

    // Group by date and sum amounts
    const grouped = expenses.reduce((acc, t) => {
      const date = t.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += t.amount;
      return acc;
    }, {});

    // Convert to array format and sort by date
    const data = Object.entries(grouped)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return data;
  }, [transactions]);

  // ── Empty state ────────────────────────────────────────────────────────
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Expenses Over Time</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Your spending activity over the selected period
          </p>
        </div>
        <div className="flex h-80 items-center justify-center">
          <div className="text-center">
            <p className="text-[14px] text-slate-400">
              No expenses found for the selected filters.
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
        <h2 className="text-lg font-bold text-slate-900">Expenses Over Time</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Your spending activity over the selected period
        </p>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>

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

            <Area
              type="monotone"
              dataKey="amount"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              dot={{ fill: '#f43f5e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensesOverTime;
