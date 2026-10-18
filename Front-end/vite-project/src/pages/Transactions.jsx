import { useMemo, useState } from 'react';
import { HiOutlineArrowDownLeft, HiOutlineArrowUpRight, HiOutlineArrowsRightLeft, HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2';
import { useTransactions } from '../context/TransactionContext';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import { useCurrencyFormatter } from '../utils/currency';

const SummaryCard = ({ label, amount, icon: Icon, tone, detail }) => {
  const formatCurrency = useCurrencyFormatter();
  return (
    <article style={{ padding: '24px' }} className="relative flex min-h-40 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:p-7">
      <div className="flex flex-1 flex-col gap-2 pr-12">
          <p className="text-sm font-medium text-slate-500 ">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(amount)}</p>
      </div>
      <span style={{ right: 24, top: 24 }} className={`absolute grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
      <p className="mt-3 text-xs leading-5 text-slate-400">{detail}</p>
    </article>
  );
};

const Transactions = () => {
  const { transactions, setTransactions } = useTransactions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '', type: 'all', category: '', paymentMethod: '', datePreset: 'all', startDate: '', endDate: '',
  });

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter((t) => [t.title, t.category, t.paymentMethod].some((value) => value.toLowerCase().includes(query)));
    }
    if (filters.type !== 'all') result = result.filter((t) => t.type === filters.type);
    if (filters.category) result = result.filter((t) => t.category === filters.category);
    if (filters.paymentMethod) result = result.filter((t) => t.paymentMethod === filters.paymentMethod);
    if (filters.startDate) result = result.filter((t) => t.date >= filters.startDate);
    if (filters.endDate) result = result.filter((t) => t.date <= filters.endDate);
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filters, transactions]);

  const totals = useMemo(() => transactions.reduce((sum, transaction) => {
    sum[transaction.type] += Number(transaction.amount);
    return sum;
  }, { income: 0, expense: 0 }), [transactions]);

  const addTransaction = (transaction) => {
    setTransactions((previous) => [transaction, ...previous]);
    setIsAddModalOpen(false);
  };

  const saveTransaction = (transaction) => {
    if (transactionToEdit) {
      setTransactions((previous) => previous.map((item) => item.id === transaction.id ? transaction : item));
      setTransactionToEdit(null);
    } else {
      addTransaction(transaction);
    }
  };

  const deleteTransaction = () => {
    if (!transactionToDelete) return;
    setTransactions((previous) => previous.filter((item) => item.id !== transactionToDelete.id));
    setTransactionToDelete(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="mx-auto w-full max-w-6xl py-6 lg:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Your finances</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Transactions</h1>
          <p className="text-sm text-slate-500">A clear view of every payment, purchase, and deposit.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto">
          <button type="button" onClick={() => setIsAddModalOpen(true)} className="h-11 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20">
            + Add Transaction
          </button>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-500 shadow-sm">
            <span className="font-semibold text-slate-900">{transactions.length}</span> total records
          </div>
        </div>
      </header>

      <section style={{ gap: 24 }} className="grid grid-cols-1 md:grid-cols-3" aria-label="Transaction totals">
        <SummaryCard label="Total income" amount={totals.income} icon={HiOutlineArrowDownLeft} tone="bg-emerald-50 text-emerald-600" detail="Money received across all transactions" />
        <SummaryCard label="Total expenses" amount={totals.expense} icon={HiOutlineArrowUpRight} tone="bg-rose-50 text-rose-600" detail="Money spent across all transactions" />
        <SummaryCard label="Net cash flow" amount={totals.income - totals.expense} icon={HiOutlineArrowsRightLeft} tone="bg-indigo-50 text-indigo-600" detail="Income minus expenses" />
      </section>

      <section style={{ padding: 24 }} className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:gap-7" aria-label="Transaction filters">
        <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-slate-900">Find a transaction</h2>
            <p className="text-sm text-slate-500">Search and narrow your activity.</p>
        </div>
        <TransactionFilters filters={filters} onFiltersChange={setFilters} />
      </section>

      <section style={{ padding: 24 }} className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
        <div style={{ marginBottom: 24 }} className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">All transactions</h2>
            <p className="mt-1.5 text-sm text-slate-500">Sorted by most recent</p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'result' : 'results'}
          </span>
        </div>
        <TransactionList transactions={filteredTransactions} onEdit={setTransactionToEdit} onDelete={setTransactionToDelete} />
      </section>
      {(isAddModalOpen || transactionToEdit) && <AddTransactionModal transaction={transactionToEdit} onClose={() => { setIsAddModalOpen(false); setTransactionToEdit(null); }} onSubmit={saveTransaction} />}
      {transactionToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setTransactionToDelete(null); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="delete-transaction-title" aria-describedby="delete-transaction-description" style={{ padding: '32px' }} className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600"><HiOutlineExclamationTriangle className="h-7 w-7" /></span>
              <button type="button" onClick={() => setTransactionToDelete(null)} aria-label="Close confirmation" className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200"><HiOutlineXMark className="h-5 w-5" /></button>
            </div>
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">Delete transaction</p>
              <h2 id="delete-transaction-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Are you sure?</h2>
              <p id="delete-transaction-description" className="mt-3 text-sm leading-6 text-slate-500">You’re about to delete <span className="font-semibold text-slate-700">{transactionToDelete.title}</span>. This action can’t be undone.</p>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setTransactionToDelete(null)} className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200">Keep transaction</button>
              <button type="button" onClick={deleteTransaction} className="h-12 rounded-xl bg-rose-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20">Delete transaction</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Transactions;
