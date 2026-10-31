import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { ZyloLogo } from '../brand/ZyloLogo';
import { CUSTOMER_NAVIGATION_ITEMS } from './CustomerSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const CustomerMobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSignOut = () => {
    logout();
    onClose();
    showToast('Signed out of customer portal', 'info');
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-ivory border-r border-stone-warm flex flex-col justify-between h-full p-4 z-10 shadow-luxury">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-stone-warm">
            <ZyloLogo variant="dark" size="sm" showWordmark={true} showTagline={false} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-espresso-muted hover:text-espresso hover:bg-champagne/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted">
              Client Portal Menu
            </span>
          </div>

          <nav className="space-y-1">
            {CUSTOMER_NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cherry text-ivory shadow-sm'
                      : 'text-espresso-muted hover:text-espresso hover:bg-champagne/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-ivory' : 'text-champagne-gold'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-stone-warm space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'Customer'}
              className="w-8 h-8 rounded-full object-cover border border-stone-warm"
            />
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-bold text-espresso truncate">{user?.name || 'Eleanor Vance'}</p>
              <p className="text-[10px] text-espresso-muted truncate">{user?.company || 'Customer'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-cherry bg-cherry-light/60 hover:bg-cherry-light transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
