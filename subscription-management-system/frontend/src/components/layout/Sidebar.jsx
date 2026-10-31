import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  RefreshCw,
  Users,
  Package,
  Layers,
  FileText,
  Receipt,
  CreditCard,
  Tag,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Subscriptions', path: '/subscriptions', icon: RefreshCw },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Plans', path: '/plans', icon: Layers },
  { name: 'Quotations', path: '/quotations', icon: FileText },
  { name: 'Invoices', path: '/invoices', icon: Receipt },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Discounts', path: '/discounts', icon: Tag },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between h-screen sticky top-0 bg-cherry-dark border-r border-cherry-darker transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
          <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-ivory flex items-center justify-center text-cherry-dark font-serif font-black text-xl shadow-md shrink-0">
              S
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span className="font-display text-xl font-bold tracking-tight text-ivory block leading-none">
                  SUBSCRIPT
                </span>
                <span className="text-[9px] uppercase tracking-widest text-champagne-gold font-semibold block mt-1">
                  Recurring Suite
                </span>
              </motion.div>
            )}
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-white/60 hover:text-ivory hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/dashboard' && location.pathname === '/');

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-ivory text-cherry-dark shadow-sm'
                    : 'text-champagne/80 hover:text-ivory hover:bg-white/10'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-cherry' : 'text-champagne-gold'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Subtle active indicator tag */}
                {isActive && (
                  <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-cherry shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer / Organization */}
      <div className="p-3 border-t border-white/10">
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
              <span className="text-xs font-semibold text-ivory">Enterprise Plan</span>
            </div>
            <p className="text-[11px] text-champagne/70 leading-snug">
              Monthly billing cycle synchronized.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="w-8 h-8 rounded-full bg-ivory/10 flex items-center justify-center text-champagne-gold text-xs font-bold" title="Enterprise Tier">
              PRO
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
