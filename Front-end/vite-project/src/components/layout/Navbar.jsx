import React from 'react';
import { HiOutlineBell, HiOutlineSearch, HiOutlineMenu } from 'react-icons/hi';

const Navbar = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-30 flex h-[68px] shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white" style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>

      {/* ── Left ── */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Open menu"
        >
          <HiOutlineMenu className="h-5 w-5" />
        </button>

        {/* Welcome text */}
        <div className="hidden sm:block">
          <p className="text-[15px] font-semibold text-slate-800">
            Good morning, Alex 👋
          </p>
          <p className="text-[13px] text-slate-400">
            Here's your financial snapshot
          </p>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative hidden md:block">
          <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            style={{ paddingLeft: '2.25rem' }}
            className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pr-4 text-[13.5px] text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>

        {/* Notification bell */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
          aria-label="Notifications"
        >
          <HiOutlineBell className="h-[18px] w-[18px]" />
          {/* Red dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* Avatar + name */}
        <button className="flex items-center gap-3 rounded-xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-[13px] font-bold text-white shadow shadow-indigo-600/30">
            A
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[13.5px] font-semibold leading-none text-slate-800">
              Alex Rivera
            </p>
            <p className="mt-0.5 text-[12px] text-slate-400">Personal</p>
          </div>
        </button>

      </div>
    </header>
  );
};

export default Navbar;
