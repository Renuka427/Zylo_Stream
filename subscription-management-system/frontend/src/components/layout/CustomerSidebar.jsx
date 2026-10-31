import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ZyloLogo } from '../brand/ZyloLogo';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  LayoutDashboard,
  RefreshCw,
  Compass,
  Receipt,
  CreditCard,
  Bell,
  User,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const CUSTOMER_NAVIGATION_ITEMS = [
  { name: 'Overview', path: '/customer/dashboard', icon: LayoutDashboard },
  { name: 'My Subscriptions', path: '/customer/subscriptions', icon: RefreshCw },
  { name: 'Explore Plans', path: '/customer/plans', icon: Compass },
  { name: 'My Invoices', path: '/customer/invoices', icon: Receipt },
  { name: 'Payment History', path: '/customer/payments', icon: CreditCard },
  { name: 'Notifications', path: '/customer/notifications', icon: Bell },
  { name: 'My Profile', path: '/customer/profile', icon: User },
  { name: 'Help & Support', path: '/customer/support', icon: HelpCircle },
];

export const CustomerSidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleSignOut = () => {
    logout();
    showToast('Signed out of customer portal', 'info');
    navigate('/login');
  };

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between h-screen sticky top-0 bg-ivory border-r border-stone-warm transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between h-20 px-4 border-b border-stone-warm">
          <NavLink to="/customer/dashboard" className="flex items-center gap-3 overflow-hidden">
            <ZyloLogo
              variant="dark"
              size="sm"
              showWordmark={!isCollapsed}
              showTagline={false}
            />
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-espresso-muted hover:text-espresso hover:bg-champagne/60 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Customer Badge */}
        {!isCollapsed && (
          <div className="px-4 py-2.5 mx-3 mt-3 rounded-xl bg-champagne-light border border-stone-warm/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-espresso-muted text-[11px] uppercase tracking-wider">
              Client Portal
            </span>
            <span className="font-mono text-[10px] font-bold text-cherry bg-champagne px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
        )}

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {CUSTOMER_NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cherry text-ivory shadow-sm'
                    : 'text-espresso-muted hover:text-espresso hover:bg-champagne/60'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-ivory' : 'text-champagne-gold'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-ivory shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Customer Account & Sign Out */}
      <div className="p-3 border-t border-stone-warm bg-champagne/30 space-y-2">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 py-1.5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'Customer'}
              className="w-8 h-8 rounded-full object-cover border border-stone-warm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-espresso truncate">{user?.name || 'Eleanor Vance'}</p>
              <p className="text-[10px] text-espresso-muted truncate">{user?.company || 'Acme Creative Studio'}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-espresso-muted hover:text-cherry hover:bg-cherry-light/50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-cherry shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
