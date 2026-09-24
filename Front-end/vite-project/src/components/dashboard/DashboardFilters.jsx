import { HiOutlineCalendar, HiOutlineX, HiOutlineChevronDown } from 'react-icons/hi';
import {
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineTrendingUp,
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlineLightningBolt,
  HiOutlineHeart,
  HiOutlineAcademicCap,
  HiOutlineGlobe,
  HiOutlineRefresh,
  HiOutlineSparkles,
  HiOutlineTruck,
  HiOutlineFilm,
  HiOutlineShoppingCart,
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineDeviceMobile,
  HiOutlineLibrary,
} from 'react-icons/hi';
import { categories, paymentMethods } from '../../data/mockData';

// ── Local date formatter ───────────────────────────────────────────────────
const localDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ── Preset range calculator ────────────────────────────────────────────────
export const getPresetRange = (preset) => {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = now.getMonth();
  switch (preset) {
    case 'this_month': return { startDate: localDateStr(new Date(y, m, 1)),     endDate: localDateStr(new Date(y, m + 1, 0)) };
    case 'last_month': return { startDate: localDateStr(new Date(y, m - 1, 1)), endDate: localDateStr(new Date(y, m, 0))     };
    case 'this_year':  return { startDate: localDateStr(new Date(y, 0, 1)),     endDate: localDateStr(new Date(y, 11, 31))   };
    default:           return { startDate: '', endDate: '' };
  }
};

// ── Category icon + color map ──────────────────────────────────────────────
const categoryMeta = {
  'Salary':           { icon: HiOutlineCurrencyDollar, color: '#22c55e' },
  'Freelance':        { icon: HiOutlineBriefcase,      color: '#3b82f6' },
  'Investments':      { icon: HiOutlineTrendingUp,     color: '#8b5cf6' },
  'Side Business':    { icon: HiOutlineShoppingBag,    color: '#f59e0b' },
  'Food & Dining':    { icon: HiOutlineShoppingCart,   color: '#ef4444' },
  'Transportation':   { icon: HiOutlineTruck,          color: '#f97316' },
  'Shopping':         { icon: HiOutlineShoppingBag,    color: '#ec4899' },
  'Entertainment':    { icon: HiOutlineFilm,           color: '#a855f7' },
  'Bills & Utilities':{ icon: HiOutlineLightningBolt,  color: '#6366f1' },
  'Healthcare':       { icon: HiOutlineHeart,          color: '#14b8a6' },
  'Education':        { icon: HiOutlineAcademicCap,    color: '#0ea5e9' },
  'Rent':             { icon: HiOutlineHome,           color: '#64748b' },
  'Subscriptions':    { icon: HiOutlineRefresh,        color: '#d946ef' },
  'Travel':           { icon: HiOutlineGlobe,          color: '#06b6d4' },
  'Groceries':        { icon: HiOutlineShoppingCart,   color: '#84cc16' },
  'Personal Care':    { icon: HiOutlineSparkles,       color: '#f472b6' },
};

// ── Payment method icon + color map ───────────────────────────────────────
const paymentMeta = {
  'Cash':                   { icon: HiOutlineCash,         color: '#22c55e' },
  'Visa •••• 4821':         { icon: HiOutlineCreditCard,   color: '#1e40af' },
  'Mastercard •••• 7392':   { icon: HiOutlineCreditCard,   color: '#dc2626' },
  'Bank Transfer':          { icon: HiOutlineLibrary,      color: '#6366f1' },
  'PayPal':                 { icon: HiOutlineGlobe,        color: '#0070ba' },
  'Apple Pay':              { icon: HiOutlineDeviceMobile, color: '#111827' },
};

// ── Preset pill button ─────────────────────────────────────────────────────
const PresetBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-lg px-4 py-2 text-[13px] font-medium transition-all ${
      active
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
    }`}
  >
    {label}
  </button>
);

// ── Active filter badge ────────────────────────────────────────────────────
const ActiveBadge = ({ icon: Icon, iconColor, label, onRemove }) => (
  <span className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[12.5px] font-medium text-indigo-700">
    {Icon && <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: iconColor }} />}
    {label}
    <button
      onClick={onRemove}
      className="ml-0.5 rounded-full text-indigo-400 transition hover:text-indigo-700"
      aria-label={`Remove ${label} filter`}
    >
      <HiOutlineX className="h-3.5 w-3.5" />
    </button>
  </span>
);

// ── Custom dropdown (replaces <select> to avoid icon-overlap issues) ───────
const Dropdown = ({ value, onChange, options, placeholder, icon: TriggerIcon }) => {
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      {/* Trigger */}
      <div className="relative">
        {/* Leading icon area */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
          {selected ? (
            <selected.icon className="h-4 w-4 shrink-0" style={{ color: selected.color }} />
          ) : (
            <TriggerIcon className="h-4 w-4 shrink-0 text-slate-400" />
          )}
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white text-[13.5px] text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
          style={{ paddingLeft: '2rem', paddingRight: '2.25rem' }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Trailing chevron */}
        <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
};

// ── Build option lists from mockData ──────────────────────────────────────
const categoryOptions = categories.map((c) => ({
  value: c.name,
  label: c.name,
  icon:  categoryMeta[c.name]?.icon  ?? HiOutlineCurrencyDollar,
  color: categoryMeta[c.name]?.color ?? '#6366f1',
}));

const paymentOptions = paymentMethods.map((pm) => ({
  value: pm.name,
  label: pm.name,
  icon:  paymentMeta[pm.name]?.icon  ?? HiOutlineCreditCard,
  color: paymentMeta[pm.name]?.color ?? '#6366f1',
}));

// ── Main component ─────────────────────────────────────────────────────────
const DashboardFilters = ({ filters, onFiltersChange }) => {
  const { preset, startDate, endDate, category, paymentMethod } = filters;

  const showCustomRange = preset === 'custom';
  const isNonDefault    = preset !== 'this_month' || !!category || !!paymentMethod;

  const setPreset = (value) => {
    if (value === 'custom') {
      onFiltersChange({ ...filters, preset: 'custom', startDate: '', endDate: '' });
    } else {
      onFiltersChange({ ...filters, preset: value, ...getPresetRange(value) });
    }
  };

  const setField = (field, value) => onFiltersChange({ ...filters, [field]: value });

  const resetAll = () =>
    onFiltersChange({
      preset:        'this_month',
      ...getPresetRange('this_month'),
      category:      '',
      paymentMethod: '',
    });

  // Badges for active category / payment method
  const activeBadges = [
    category      && { key: 'category',      label: category,      ...categoryMeta[category] },
    paymentMethod && { key: 'paymentMethod', label: paymentMethod, ...paymentMeta[paymentMethod] },
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5 space-y-4">

        {/* ── Row 1: preset pills + dropdowns + reset ── */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            <PresetBtn label="This Month" active={preset === 'this_month'} onClick={() => setPreset('this_month')} />
            <PresetBtn label="Last Month" active={preset === 'last_month'} onClick={() => setPreset('last_month')} />
            <PresetBtn label="This Year"  active={preset === 'this_year'}  onClick={() => setPreset('this_year')}  />
            <PresetBtn label="Custom"     active={preset === 'custom'}     onClick={() => setPreset('custom')}     />
          </div>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          {/* Category dropdown */}
          <div className="w-48">
            <Dropdown
              value={category}
              onChange={(v) => setField('category', v)}
              options={categoryOptions}
              placeholder="All Categories"
              icon={HiOutlineShoppingBag}
            />
          </div>

          {/* Payment method dropdown */}
          <div className="w-52">
            <Dropdown
              value={paymentMethod}
              onChange={(v) => setField('paymentMethod', v)}
              options={paymentOptions}
              placeholder="All Methods"
              icon={HiOutlineCreditCard}
            />
          </div>

          {/* Reset — only when non-default */}
          {isNonDefault && (
            <button
              onClick={resetAll}
              className="ml-auto flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition hover:text-slate-700"
            >
              <HiOutlineX className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* ── Row 2: custom date range ── */}
        {showCustomRange && (
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-slate-500">
              <HiOutlineCalendar className="h-4 w-4 shrink-0" />
              <span className="text-[13px]">From</span>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setField('startDate', e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13.5px] text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
            />
            <span className="text-[13px] text-slate-400">—</span>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-[13px]">To</span>
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setField('endDate', e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[13.5px] text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        )}

        {/* ── Row 3: active filter badges ── */}
        {activeBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            <span className="self-center text-[12px] text-slate-400">Active filters:</span>
            {activeBadges.map(({ key, label, icon, color }) => (
              <ActiveBadge
                key={key}
                icon={icon}
                iconColor={color}
                label={label}
                onRemove={() => setField(key, '')}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardFilters;
