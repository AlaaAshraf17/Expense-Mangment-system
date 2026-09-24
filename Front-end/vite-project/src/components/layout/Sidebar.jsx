import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineSwitchHorizontal,
  HiOutlineTag,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard',       path: '/dashboard',    icon: HiOutlineViewGrid },
  { label: 'Transactions',    path: '/transactions', icon: HiOutlineSwitchHorizontal },
  { label: 'Categories',      path: '/categories',   icon: HiOutlineTag },
  { label: 'Payment Methods', path: '/payments',     icon: HiOutlineCreditCard },
  { label: 'Settings',        path: '/settings',     icon: HiOutlineCog },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-screen flex-col
          bg-[#0f1623] transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-[72px]' : 'w-60'}
        `}
      >
        {/* ── Brand ── */}
        <div className="flex h-[68px] shrink-0 items-center justify-between px-6 py-5">
          {!collapsed && (
            <NavLink to="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/40">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-[17px] font-bold tracking-tight text-white">
                Spendly
              </span>
            </NavLink>
          )}

          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/40">
              <span className="text-sm font-bold text-white">S</span>
            </div>
          )}

          {/* Collapse toggle — desktop only, shown when expanded */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden rounded-md p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300 lg:block"
              aria-label="Collapse sidebar"
            >
              <HiOutlineChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300 lg:hidden"
            aria-label="Close sidebar"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Expand button — shown when collapsed, desktop only */}
        {collapsed && (
          <div className="flex justify-center pb-2">
            <button
              onClick={() => setCollapsed(false)}
              className="hidden rounded-md p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300 lg:block"
              aria-label="Expand sidebar"
            >
              <HiOutlineChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Top divider ── */}
        <div className="mx-5 h-px bg-white/[0.07]" />

        {/* ── Navigation ── */}
        <nav className="sidebar-scroll flex flex-1 flex-col overflow-y-auto px-4 py-7">
          {!collapsed && (
            <p className="mb-4 px-4 text-[13px] font-semibold uppercase tracking-widest text-slate-600">
              Navigation
            </p>
          )}

          {/* Nav items with generous vertical spacing */}
          <div className="flex flex-col gap-3">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                    collapsed
                      ? 'justify-center py-4 px-0'
                      : 'gap-3.5 px-5 py-4'
                  } ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ── Bottom divider ── */}
        <div className="mx-5 h-px bg-white/[0.07]" />

        {/* ── Logout — clearly styled in rose/red for destructive action ── */}
        <div className="px-4 py-6">
          <button
            title={collapsed ? 'Log out' : undefined}
            className={`flex w-full items-center rounded-xl text-[13.5px] font-semibold transition-all duration-150
              text-rose-400 hover:bg-rose-500/10 hover:text-rose-300
              ${collapsed ? 'justify-center py-4 px-0' : 'gap-3.5 px-5 py-4'}`}
          >
            <HiOutlineLogout className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
