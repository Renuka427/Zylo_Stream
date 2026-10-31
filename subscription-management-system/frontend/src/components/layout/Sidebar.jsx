import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ZyloLogo } from '../brand/ZyloLogo';
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
  { name: 'Overview', path: '/admin/dashboard', alias: '/dashboard', icon: LayoutDashboard },
  { name: 'Subscriptions', path: '/admin/subscriptions', alias: '/subscriptions', icon: RefreshCw },
  { name: 'Customers', path: '/admin/customers', alias: '/customers', icon: Users },
  { name: 'Products', path: '/admin/products', alias: '/products', icon: Package },
  { name: 'Plans', path: '/admin/plans', alias: '/plans', icon: Layers },
  { name: 'Quotations', path: '/admin/quotations', alias: '/quotations', icon: FileText },
  { name: 'Invoices', path: '/admin/invoices', alias: '/invoices', icon: Receipt },
  { name: 'Payments', path: '/admin/payments', alias: '/payments', icon: CreditCard },
  { name: 'Discounts', path: '/admin/discounts', alias: '/discounts', icon: Tag },
  { name: 'Reports', path: '/admin/reports', alias: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', alias: '/settings', icon: Settings },
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
          <NavLink to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <ZyloLogo
              variant="light"
              size="sm"
              showWordmark={!isCollapsed}
              showTagline={false}
            />
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
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname === item.alias ||
              (item.path === '/admin/dashboard' &&
                (location.pathname === '/admin' || location.pathname === '/dashboard'));

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

      {/* Bottom Footer / Portal Switcher */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {!isCollapsed ? (
          <>
            <NavLink
              to="/customer/dashboard"
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-champagne/90 hover:text-ivory text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
                <span>Customer Portal</span>
              </div>
              <span className="text-[10px] text-champagne-gold font-mono">&rarr;</span>
            </NavLink>

            <div className="px-2 py-1 flex items-center justify-between text-[10px] text-champagne/60">
              <span>Admin Role Verified</span>
              <span>v1.0 Demo</span>
            </div>
          </>
        ) : (
          <div className="flex justify-center py-2">
            <NavLink
              to="/customer/dashboard"
              className="w-8 h-8 rounded-full bg-ivory/10 flex items-center justify-center text-champagne-gold text-xs font-bold hover:bg-ivory/20"
              title="Customer Portal"
            >
              CP
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};
