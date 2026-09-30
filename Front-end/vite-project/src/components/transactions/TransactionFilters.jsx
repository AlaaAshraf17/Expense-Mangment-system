import { HiOutlineSearch, HiOutlineFilter, HiOutlineX } from 'react-icons/hi';
import { categories, paymentMethods } from '../../data/mockData';

// ── Date preset options ────────────────────────────────────────────────────
const getDatePreset = (preset) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  
  const localDateStr = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  switch (preset) {
    case 'this_month':
      return {
        startDate: localDateStr(new Date(y, m, 1)),
        endDate: localDateStr(new Date(y, m + 1, 0)),
      };
    case 'last_month':
      return {
        startDate: localDateStr(new Date(y, m - 1, 1)),
        endDate: localDateStr(new Date(y, m, 0)),
      };
    case 'this_year':
      return {
        startDate: localDateStr(new Date(y, 0, 1)),
        endDate: localDateStr(new Date(y, 11, 31)),
      };
    default:
      return { startDate: '', endDate: '' };
  }
};

const TransactionFilters = ({ filters, onFiltersChange }) => {
  const { search, type, category, paymentMethod, datePreset, startDate, endDate } = filters;

  const setField = (field, value) => onFiltersChange({ ...filters, [field]: value });

  const handleDatePresetChange = (preset) => {
    if (preset === 'custom') {
      onFiltersChange({ ...filters, datePreset: 'custom', startDate: '', endDate: '' });
    } else if (preset === 'all') {
      onFiltersChange({ ...filters, datePreset: 'all', startDate: '', endDate: '' });
    } else {
      const dates = getDatePreset(preset);
      onFiltersChange({ ...filters, datePreset: preset, ...dates });
    }
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      category: '',
      paymentMethod: '',
      datePreset: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = search || type !== 'all' || category || paymentMethod || datePreset !== 'all';

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 flex items-center pl-4">
          <HiOutlineSearch className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setField('search', e.target.value)}
          style={{ paddingLeft: '2.75rem' }}
          className="block w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-4 text-[14px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
        />
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type filter */}
        <select
          value={type}
          onChange={(e) => setField('type', e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-[13.5px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setField('category', e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-[13.5px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Payment method filter */}
        <select
          value={paymentMethod}
          onChange={(e) => setField('paymentMethod', e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-[13.5px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
        >
          <option value="">All Methods</option>
          {paymentMethods.map((pm) => (
            <option key={pm.id} value={pm.name}>
              {pm.name}
            </option>
          ))}
        </select>

        {/* Date preset filter */}
        <select
          value={datePreset}
          onChange={(e) => handleDatePresetChange(e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-[13.5px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
        >
          <option value="all">All Time</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13.5px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
          >
            <HiOutlineX className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      {/* Custom date range */}
      {datePreset === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-5">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-slate-600">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setField('startDate', e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <span className="text-[13px] font-medium text-slate-400">—</span>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-slate-600">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setField('endDate', e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
