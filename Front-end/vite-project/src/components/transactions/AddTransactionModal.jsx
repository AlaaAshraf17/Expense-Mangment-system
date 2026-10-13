import { useEffect, useRef, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { categories, paymentMethods } from '../../data/mockData';

const localDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const emptyForm = () => ({ type: 'expense', title: '', amount: '', category: '', paymentMethod: '', date: localDate() });

const AddTransactionModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.type || !form.title.trim() || !form.amount || !form.category || !form.paymentMethod || !form.date) {
      setError('Complete all fields to add this transaction.');
      return;
    }
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    onSubmit({
      id: globalThis.crypto?.randomUUID?.() ?? `txn-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: form.type,
      title: form.title.trim(),
      amount,
      category: form.category,
      paymentMethod: form.paymentMethod,
      date: form.date,
    });
    setForm(emptyForm());
  };

  const inputClass = 'h-12 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10';
  const inputStyle = { padding: '0 16px' };
  const labelClass = 'block text-sm font-medium text-slate-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="add-transaction-title" className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
        <div style={{ padding: '20px 28px' }} className="flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Your finances</p>
            <h2 id="add-transaction-title" className="text-2xl font-bold tracking-tight text-slate-900">Add Transaction</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/15"><HiOutlineX className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="flex flex-col gap-2">
            <label htmlFor="transaction-type" className={labelClass}>Type</label>
            <select id="transaction-type" required value={form.type} onChange={(e) => setField('type', e.target.value)} style={inputStyle} className={inputClass}>
              <option value="income">Income</option><option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="transaction-title" className={labelClass}>Title</label>
            <input ref={titleRef} id="transaction-title" required value={form.title} onChange={(e) => setField('title', e.target.value)} style={inputStyle} className={inputClass} placeholder="e.g. Coffee Shop" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="transaction-amount" className={labelClass}>Amount</label>
              <input id="transaction-amount" required type="number" min="0.01" step="any" value={form.amount} onChange={(e) => setField('amount', e.target.value)} style={inputStyle} className={inputClass} placeholder="0.00" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="transaction-date" className={labelClass}>Date</label>
              <input id="transaction-date" required type="date" value={form.date} onChange={(e) => setField('date', e.target.value)} style={inputStyle} className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="transaction-category" className={labelClass}>Category</label>
            <select id="transaction-category" required value={form.category} onChange={(e) => setField('category', e.target.value)} style={inputStyle} className={inputClass}>
              <option value="" disabled>Select a category</option>
              {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="transaction-payment-method" className={labelClass}>Payment Method</label>
            <select id="transaction-payment-method" required value={form.paymentMethod} onChange={(e) => setField('paymentMethod', e.target.value)} style={inputStyle} className={inputClass}>
              <option value="" disabled>Select a payment method</option>
              {paymentMethods.map((method) => <option key={method.id} value={method.name}>{method.name}</option>)}
            </select>
          </div>
          {error && <p role="alert" style={{ padding: '12px 16px' }} className="rounded-xl border border-rose-200 bg-rose-50 text-sm font-medium text-rose-700">{error}</p>}
          <div style={{ paddingTop: 20 }} className="flex flex-col-reverse gap-3 border-t border-slate-100 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} style={{ padding: '0 24px' }} className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200">Cancel</button>
            <button type="submit" style={{ padding: '0 24px' }} className="h-12 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20">Add Transaction</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddTransactionModal;
