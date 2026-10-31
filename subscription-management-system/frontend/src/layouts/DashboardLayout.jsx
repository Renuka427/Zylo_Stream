import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { MobileDrawer } from '../components/layout/MobileDrawer';

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-champagne text-espresso flex">
      {/* Desktop Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-8 border-t border-stone-warm text-xs text-espresso-muted flex flex-col sm:flex-row items-center justify-between gap-2 bg-champagne/40">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-cherry-dark">SUBSCRIPT</span>
            <span>&bull;</span>
            <span>Recurring Revenue Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-700 font-medium">● Local Mock Sandbox Mode</span>
            <span>v1.0.0 (Hackathon Edition)</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
