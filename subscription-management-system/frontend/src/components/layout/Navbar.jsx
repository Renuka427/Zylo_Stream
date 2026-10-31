import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Calendar,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const Navbar = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, login } = useAuth();
  const { showToast } = useToast();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedRange, setSelectedRange] = useState('October 2026');

  // Breadcrumb / title determination
  const getSubPath = () => {
    if (location.pathname.startsWith('/admin')) {
      return location.pathname.split('/')[2] || 'dashboard';
    }
    return location.pathname.split('/')[1] || 'dashboard';
  };

  const getPageTitle = () => {
    const path = getSubPath();
    switch (path) {
      case 'dashboard':
        return 'Executive Overview';
      case 'subscriptions':
        return 'Subscription Ledger';
      case 'customers':
        return 'Customer Directory';
      case 'products':
        return 'Product Catalog';
      case 'plans':
        return 'Pricing Schemes';
      case 'quotations':
        return 'Quotations & Estimates';
      case 'invoices':
        return 'Billing & Invoices';
      case 'payments':
        return 'Payment Transactions';
      case 'discounts':
        return 'Promotions & Coupons';
      case 'reports':
        return 'Financial Intelligence';
      case 'settings':
        return 'System Preferences';
      default:
        return 'Subscription Management';
    }
  };

  const notifications = [
    { id: 1, title: 'Payment Confirmed', desc: '$3,456.00 received from Aura Logistics', time: '10m ago' },
    { id: 2, title: 'Subscription Renewed', desc: 'Cobalt Horizon renewed Enterprise tier', time: '1h ago' },
    { id: 3, title: 'Past Due Alert', desc: 'Solace Health AI failed rebill attempt', time: '3h ago' }
  ];

  return (
    <header className="sticky top-0 z-20 bg-champagne/90 backdrop-blur-md border-b border-stone-warm px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-ivory border border-stone-warm text-espresso hover:text-cherry"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-espresso-muted uppercase font-mono">
            <span>ZYLO STREAM</span>
            <span>/</span>
            <span className="text-cherry font-bold">
              {getSubPath().toUpperCase()}
            </span>
          </div>
          <h2 className="font-display text-lg md:text-xl font-bold text-espresso tracking-tight leading-tight">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Right Controls: Date Filter + Notifications + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Date Selector Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ivory border border-stone-warm text-xs text-espresso shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-champagne-gold" />
          <select
            value={selectedRange}
            onChange={(e) => {
              setSelectedRange(e.target.value);
              showToast(`Date filter set to: ${e.target.value}`);
            }}
            className="bg-transparent font-medium focus:outline-none cursor-pointer"
          >
            <option value="October 2026">October 2026 (Current)</option>
            <option value="Q3 2026">Q3 2026</option>
            <option value="Year-to-Date 2026">Year-to-Date 2026</option>
            <option value="All Time">All Time</option>
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl bg-ivory border border-stone-warm text-espresso hover:text-cherry transition-colors shadow-sm"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cherry animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-ivory rounded-2xl border border-stone-warm shadow-luxury-lg p-4 z-40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-warm">
                <span className="font-display text-sm font-bold text-espresso">Notifications</span>
                <span className="text-[10px] uppercase font-bold text-cherry bg-cherry-light px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-champagne/40 transition-colors border border-transparent hover:border-stone-warm/50">
                    <p className="text-xs font-semibold text-espresso">{n.title}</p>
                    <p className="text-[11px] text-espresso-muted leading-tight mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-stone-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-xl bg-ivory border border-stone-warm text-xs font-medium text-espresso hover:border-champagne-gold/60 transition-colors shadow-sm"
          >
            <span className="hidden sm:inline font-medium text-xs max-w-[100px] truncate">
              {user ? user.name : 'Guest User'}
            </span>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-7 h-7 rounded-lg object-cover border border-champagne-gold/40"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-ivory rounded-2xl border border-stone-warm shadow-luxury-lg p-3 z-40 space-y-2">
              <div className="px-2 py-2 border-b border-stone-warm">
                <p className="text-xs font-bold text-espresso">{user?.name || 'Demo Administrator'}</p>
                <p className="text-[11px] text-espresso-muted truncate">{user?.email || 'elena.vance@subscript-saas.com'}</p>
                <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-champagne-gold/20 text-[#8C621E]">
                  {user?.role || 'VP Finance'}
                </span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-espresso rounded-lg hover:bg-champagne/40 transition-colors flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-cherry" />
                  Account & Settings
                </button>

                <button
                  onClick={() => {
                    navigate('/customer/dashboard');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-espresso rounded-lg hover:bg-champagne/40 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
                  View Customer Portal
                </button>

                <button
                  onClick={() => {
                    logout();
                    showToast('Administrator session ended', 'info');
                    navigate('/admin/login');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-cherry rounded-lg hover:bg-cherry-light transition-colors flex items-center gap-2 border-t border-stone-warm/50 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
