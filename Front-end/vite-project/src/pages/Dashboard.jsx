import { useMemo } from 'react';
import {
  HiOutlineCash,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCalculator,
} from 'react-icons/hi';
import SummaryCard from '../components/dashboard/SummaryCard';
import { transactions } from '../data/mockData';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);

const Dashboard = () => {
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    const uniqueMonths = new Set(
      transactions.map((t) => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${d.getMonth()}`;
      })
    ).size;

    const monthlyAvg = uniqueMonths > 0 ? totalExpenses / uniqueMonths : 0;

    return { totalIncome, totalExpenses, totalBalance, monthlyAvg };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-1 text-[14px] text-slate-400">
          All accounts · {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={fmt(metrics.totalBalance)}
          icon={HiOutlineCash}
          color="indigo"
          subtitle="Current net position"
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
          subtitle="Based on 6 months"
        />
      </div>

    </div>
  );
};

export default Dashboard;
