import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { useToast } from '../../contexts/ToastContext';

export const CustomerNavbar = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const { customerNotifications, markCustomerNotificationRead } = useMockData();
  const { showToast } = useToast();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = customerNotifications?.filter((n) => !n.read).length || 0;

  const getPageTitle = () => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    switch (path) {
      case 'dashboard':
        return 'Customer Overview';
      case 'subscriptions':
        return 'My Subscriptions';
      case 'plans':
        return 'Explore Plans';
      case 'invoices':
        return 'My Invoices';
      case 'payments':
        return 'Payment History';
      case 'notifications':
        return 'Notification Center';
      case 'profile':
        return 'My Profile';
      case 'support':
        return 'Help & Support';
      default:
        return 'Customer Portal';
    }
  };

  const handleSignOut = () => {
    logout();
    showToast('Signed out of customer portal', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-champagne/90 backdrop-blur-md border-b border-stone-warm px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Page Title / Breadcrumbs */}
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
            <span className="text-cherry font-bold">CUSTOMER PORTAL</span>
          </div>
          <h2 className="font-display text-lg md:text-xl font-bold text-espresso tracking-tight leading-tight">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Right Controls: Notifications + Profile + Demo Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-ivory border border-stone-warm text-espresso-muted hover:text-cherry hover:border-cherry transition-colors relative shadow-sm"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cherry text-ivory text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-ivory border border-stone-warm shadow-luxury p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-stone-warm pb-2">
                <span className="font-display text-sm font-bold text-espresso">Notifications</span>
                <Link
                  to="/customer/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-cherry font-semibold hover:underline"
                >
                  View all ({customerNotifications?.length || 0})
                </Link>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {customerNotifications?.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markCustomerNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-champagne-light/50 border-stone-warm/50 text-espresso-muted'
                        : 'bg-white border-cherry/30 text-espresso font-medium shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-espresso-muted mb-1">
                      <span className="font-bold text-cherry-dark uppercase tracking-wider">{n.type}</span>
                      <span>{n.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-[11px] text-espresso-muted mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-ivory border border-stone-warm hover:border-cherry transition-colors shadow-sm"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'Customer'}
              className="w-7 h-7 rounded-full object-cover border border-stone-warm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-espresso leading-tight">{user?.name || 'Eleanor Vance'}</p>
              <p className="text-[10px] text-espresso-muted leading-tight">Customer Account</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-ivory border border-stone-warm shadow-luxury p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-stone-warm/60">
                <p className="text-xs font-bold text-espresso truncate">{user?.name || 'Eleanor Vance'}</p>
                <p className="text-[11px] text-espresso-muted truncate">{user?.email || 'eleanor.vance@acmestudio.io'}</p>
              </div>

              <Link
                to="/customer/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-espresso hover:bg-champagne/60 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-champagne-gold" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  switchRole('admin');
                  showToast('Switched to Administrator session!', 'success');
                  navigate('/admin/dashboard');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cherry-dark hover:bg-cherry-light/50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cherry" />
                <span>Switch to Admin Demo</span>
              </button>

              <div className="pt-1 border-t border-stone-warm/60">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-cherry hover:bg-cherry-light/50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
