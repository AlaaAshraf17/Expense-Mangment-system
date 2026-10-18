import { useState } from 'react';
import {
  HiOutlineArrowDownTray,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineTrash,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useTransactions } from '../context/TransactionContext';
import { useSettings } from '../context/SettingsContext';

const escapeCsvField = (value) => {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const SettingsCard = ({ icon: Icon, title, description, children }) => (
  <section style={{ padding: 24 }} className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:p-7">
    <div className="flex items-start gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Icon className="h-5 w-5" /></span>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
    <div style={{ marginTop: 24, paddingTop: 24 }}>{children}</div>
  </section>
);

const Settings = () => {
  const { transactions, setTransactions } = useTransactions();
  const { preferences, setPreferences } = useSettings();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setFeedback('');
  };

  const exportTransactions = () => {
    const columns = ['ID', 'Type', 'Title', 'Amount', 'Category', 'Payment Method', 'Date'];
    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.type,
      transaction.title,
      transaction.amount,
      transaction.category,
      transaction.paymentMethod,
      transaction.date,
    ]);
    const csv = [columns, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spendly-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setFeedback(`Exported ${transactions.length} ${transactions.length === 1 ? 'transaction' : 'transactions'} to CSV.`);
  };

  const clearTransactions = () => {
    setTransactions([]);
    setIsClearDialogOpen(false);
    setFeedback('All transactions have been cleared.');
  };

  const selectClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="mx-auto w-full max-w-6xl py-6 lg:py-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Your finances</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Settings</h1>
        <p className="text-sm text-slate-500">Manage your preferences and application data.</p>
      </header>

      <SettingsCard icon={HiOutlineCurrencyDollar} title="Preferences" description="Choose the formats you prefer to use in Spendly.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="preferred-currency" className="text-sm font-medium text-slate-700">Currency</label>
            <select id="preferred-currency" value={preferences.currency} onChange={(event) => updatePreference('currency', event.target.value)} className={selectClass}>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="EGP">EGP — Egyptian Pound</option>
            </select>
            <p className="text-xs leading-5 text-slate-500">Changes the currency display format only. Values aren’t converted or changed.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="preferred-date-format" className="text-sm font-medium text-slate-700">Date format</label>
            <select id="preferred-date-format" value={preferences.dateFormat} onChange={(event) => updatePreference('dateFormat', event.target.value)} className={selectClass}>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
            <p className="text-xs leading-5 text-slate-500">Saved on this device as a preference. Existing date displays are not changed.</p>
          </div>
        </div>
        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-emerald-700">{feedback}</p>
      </SettingsCard>

      <SettingsCard icon={HiOutlineArrowDownTray} title="Data Management" description="Export a copy of your transactions or clear your transaction history.">
        <div className="flex flex-col gap-5">
          <article style={{ padding: 20 }} className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><HiOutlineArrowDownTray className="h-5 w-5" /></span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Export transactions</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Download {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'} as a CSV file.</p>
              </div>
            </div>
            <button type="button" onClick={exportTransactions} style={{ padding: '0 20px' }} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/20 sm:ml-14">
              <HiOutlineArrowDownTray className="h-4 w-4" /> Export CSV
            </button>
          </article>
          <article style={{ padding: 20 }} className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><HiOutlineTrash className="h-5 w-5" /></span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Clear transactions</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Remove all transaction records from this device. This can’t be undone.</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsClearDialogOpen(true)} disabled={transactions.length === 0} style={{ padding: '0 20px' }} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white text-sm font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-14">
              <HiOutlineTrash className="h-4 w-4" /> Clear All
            </button>
          </article>
        </div>
        {feedback && <p role="status" aria-live="polite" className="mt-5 text-sm text-emerald-700">{feedback}</p>}
      </SettingsCard>

      <SettingsCard icon={HiOutlineInformationCircle} title="About Spendly" description="Spendly helps you understand your money with a clear view of income, spending, and payment activity.">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-700">Spendly Personal Finance Manager</span>
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Version 1.0</span>
        </div>
      </SettingsCard>

      {isClearDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsClearDialogOpen(false); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="clear-transactions-title" aria-describedby="clear-transactions-description" style={{ padding: 32 }} className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600"><HiOutlineExclamationTriangle className="h-7 w-7" /></span>
              <button type="button" onClick={() => setIsClearDialogOpen(false)} aria-label="Close confirmation" className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200"><HiOutlineXMark className="h-5 w-5" /></button>
            </div>
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">Clear transaction data</p>
              <h2 id="clear-transactions-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Clear all transactions?</h2>
              <p id="clear-transactions-description" className="mt-3 text-sm leading-6 text-slate-500">This will permanently remove all {transactions.length} transaction records from this device. This action cannot be undone. Your saved preferences will remain unchanged.</p>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsClearDialogOpen(false)} className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200">Cancel</button>
              <button type="button" onClick={clearTransactions} className="h-12 rounded-xl bg-rose-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20">Clear all transactions</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Settings;
