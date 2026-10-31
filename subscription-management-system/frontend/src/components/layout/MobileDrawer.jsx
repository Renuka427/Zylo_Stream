import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NAVIGATION_ITEMS } from './Sidebar';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso/50 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-72 max-w-[85vw] h-full bg-cherry-dark border-r border-cherry-darker shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between h-20 px-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ivory flex items-center justify-center text-cherry-dark font-serif font-black text-xl shadow-md">
                    S
                  </div>
                  <div>
                    <span className="font-display text-xl font-bold tracking-tight text-ivory block leading-none">
                      SUBSCRIPT
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-champagne-gold font-semibold block mt-1">
                      Recurring Suite
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-white/60 hover:text-ivory hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                {NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === '/dashboard' && location.pathname === '/');

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-ivory text-cherry-dark font-semibold shadow-sm'
                          : 'text-champagne/80 hover:text-ivory hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cherry' : 'text-champagne-gold'}`} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-white/10 text-xs text-champagne/60 text-center">
              Subscription Management System &copy; 2026
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
