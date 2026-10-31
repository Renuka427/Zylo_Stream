import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ZyloLogo } from '../brand/ZyloLogo';
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
                <ZyloLogo
                  variant="light"
                  size="md"
                  showWordmark={true}
                  showTagline={true}
                />

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
              Zylo Stream &copy; 2026. Your Subscription, On Autopilot.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
