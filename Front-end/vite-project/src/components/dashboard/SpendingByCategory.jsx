import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ── Currency formatter ─────────────────────────────────────────────────────
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

// ── Category colors map ────────────────────────────────────────────────────
// These match the colors from mockData.js
const categoryColors = {
  'Food & Dining':     '#ef4444',
  'Transportation':    '#f97316',
  'Shopping':          '#ec4899',
  'Entertainment':     '#a855f7',
  'Bills & Utilities': '#6366f1',
  'Healthcare':        '#14b8a6',
  'Education':         '#0ea5e9',
  'Rent':              '#64748b',
  'Subscriptions':     '#d946ef',
  'Travel':            '#06b6d4',
  'Groceries':         '#84cc16',
  'Personal Care':     '#f472b6',
};

// ── Custom tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-[12px] font-medium text-slate-600">{data.name}</p>
      <p className="text-[15px] font-bold text-slate-900">
        {formatCurrency(data.value)}
      </p>
      <p className="text-[11px] text-slate-500">
        {data.percentage}% of total
      </p>
    </div>
  );
};

// ── Custom legend ──────────────────────────────────────────────────────────
const CustomLegend = ({ payload }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px]">
      {payload.map((entry, index) => {
        const dataItem = entry.payload;
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2.5">
            <div
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate text-slate-700 font-medium">{entry.value}</span>
            <span className="ml-auto text-slate-500 text-[12px]">
              {dataItem.percentage}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const SpendingByCategory = ({ transactions }) => {
  // ── Transform filtered transactions into chart data ──────────────────────
  const chartData = useMemo(() => {
    // Filter only expense transactions
    const expenses = transactions.filter((t) => t.type === 'expense');

    // If no expenses, return empty array
    if (expenses.length === 0) return [];

    // Group by category and sum amounts
    const grouped = expenses.reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += t.amount;
      return acc;
    }, {});

    // Calculate total for percentage calculation
    const total = Object.values(grouped).reduce((sum, amount) => sum + amount, 0);

    // Convert to array format and sort by amount (highest to lowest)
    const data = Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(1),
        color: categoryColors[name] || '#6366f1', // fallback color
      }))
      .sort((a, b) => b.value - a.value);

    return data;
  }, [transactions]);

  // ── Empty state ────────────────────────────────────────────────────────
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Spending by Category</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            See where your money is going
          </p>
        </div>
        <div className="flex h-80 items-center justify-center">
          <div className="text-center">
            <p className="text-[14px] text-slate-400">
              No spending found for the selected filters.
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
        <h2 className="text-lg font-bold text-slate-900">Spending by Category</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          See where your money is going
        </p>
      </div>

      {/* Chart */}
      <div className="flex flex-col items-center">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                label={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend below chart */}
        <div className="w-full max-w-2xl">
          <CustomLegend payload={chartData.map(item => ({ 
            value: item.name, 
            color: item.color,
            payload: item
          }))} />
        </div>
      </div>
    </div>
  );
};

export default SpendingByCategory;
