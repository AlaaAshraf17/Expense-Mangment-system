import { useMemo, useState } from 'react';
import {
  HiOutlineCash,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCalculator,
} from 'react-icons/hi';
import SummaryCard from '../components/dashboard/SummaryCard';
import DashboardFilters, { getPresetRange } from '../components/dashboard/DashboardFilters';
import ExpensesOverTime from '../components/dashboard/ExpensesOverTime';
import SpendingByCategory from '../components/dashboard/SpendingByCategory';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { transactions } from '../data/mockData';

// ── Currency formatter ─────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);

// ── Local date formatter — avoids timezone shifts from toISOString() ──────
const localDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ── Default filter: current month ─────────────────────────────────────────
const buildDefaultFilters = () => {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = now.getMonth();
  return {
    preset:        'this_month',
    startDate:     localDateStr(new Date(y, m, 1)),
    endDate:       localDateStr(new Date(y, m + 1, 0)),
    category:      '',
    paymentMethod: '',
  };
};

// ── Dashboard ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [filters, setFilters] = useState(buildDefaultFilters);

  // ── Derive filtered transactions from the selected filters ──────────────
  // This will be consumed by charts and recent-transactions sections later.
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Date range
      if (filters.startDate && t.date < filters.startDate) return false;
      if (filters.endDate   && t.date > filters.endDate)   return false;
      // Category
      if (filters.category && t.category !== filters.category) return false;
      // Payment method
      if (filters.paymentMethod && t.paymentMethod !== filters.paymentMethod) return false;
      return true;
    });
  }, [filters]);

  // ── Summary metrics from filteredTransactions ──────────────────────────
  const metrics = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    const uniqueMonths = new Set(
      filteredTransactions.map((t) => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${d.getMonth()}`;
      })
    ).size;

    const monthlyAvg = uniqueMonths > 0 ? totalExpenses / uniqueMonths : 0;

    return { totalIncome, totalExpenses, totalBalance, monthlyAvg };
  }, [filteredTransactions]);

  // ── Page subtitle reflects the active date range ───────────────────────
  const subtitle = useMemo(() => {
    const labels = {
      this_month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      last_month: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      })(),
      this_year:  String(new Date().getFullYear()),
      custom:     filters.startDate && filters.endDate
        ? `${filters.startDate} – ${filters.endDate}`
        : 'Custom range',
    };
    return labels[filters.preset] ?? 'All time';
  }, [filters.preset, filters.startDate, filters.endDate]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-1 text-[14px] text-slate-400">
          All accounts · {subtitle}
        </p>
      </div>

      {/* ── Filters ── */}
      <DashboardFilters filters={filters} onFiltersChange={setFilters} />

      {/* ── Summary cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" style={{ marginTop: '2rem' }}>
        <SummaryCard
          title="Total Balance"
          value={fmt(metrics.totalBalance)}
          icon={HiOutlineCash}
          color="indigo"
          subtitle="Net position"
        />
        <SummaryCard
          title="Total Income"
          value={fmt(metrics.totalIncome)}
          icon={HiOutlineTrendingUp}
          color="emerald"
          subtitle="All income sources"
        />
        <SummaryCard
          title="Total Expenses"
          value={fmt(metrics.totalExpenses)}
          icon={HiOutlineTrendingDown}
          color="rose"
          subtitle="All spending"
        />
        <SummaryCard
          title="Monthly Avg Spend"
          value={fmt(metrics.monthlyAvg)}
          icon={HiOutlineCalculator}
          color="amber"
          subtitle={`Based on ${
            new Set(filteredTransactions.map((t) => {
              const d = new Date(t.date);
              return `${d.getFullYear()}-${d.getMonth()}`;
            })).size
          } month(s)`}
        />
      </div>

      {/* ── Expenses Over Time Chart ── */}
      <div style={{ marginTop: '2rem' }}>
        <ExpensesOverTime transactions={filteredTransactions} />
      </div>

      {/* ── Spending by Category Chart ── */}
      <div style={{ marginTop: '2rem' }}>
        <SpendingByCategory transactions={filteredTransactions} />
      </div>

      {/* ── Recent Transactions ── */}
      <div style={{ marginTop: '2rem' }}>
        <RecentTransactions transactions={filteredTransactions} />
      </div>

    </div>
  );
};

export default Dashboard;
