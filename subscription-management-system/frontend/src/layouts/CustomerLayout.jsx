import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerSidebar } from '../components/layout/CustomerSidebar';
import { CustomerNavbar } from '../components/layout/CustomerNavbar';
import { CustomerMobileDrawer } from '../components/layout/CustomerMobileDrawer';

export const CustomerLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-champagne text-espresso flex selection:bg-cherry selection:text-ivory">
      {/* Customer Desktop Sidebar */}
      <CustomerSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Customer Mobile Drawer */}
      <CustomerMobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <CustomerNavbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-8 border-t border-stone-warm text-xs text-espresso-muted flex flex-col sm:flex-row items-center justify-between gap-2 bg-champagne/40">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-cherry-dark">ZYLO STREAM</span>
            <span>&bull;</span>
            <span>Customer Subscription Self-Service Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-700 font-medium">● Customer Scope Active</span>
            <span>Your Subscription, On Autopilot.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
