import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { ZyloLogo } from '../../../components/brand/ZyloLogo';
import { Button } from '../../../components/ui/Button';

export const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: '3D Features', id: '3d-features' },
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Solutions', id: 'solutions' },
    { label: 'FAQ', id: 'faq' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-champagne/95 backdrop-blur-md shadow-luxury border-b border-stone-warm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-2 group">
            <ZyloLogo
              variant="dark"
              size="md"
              showWordmark={true}
              showTagline={false}
            />
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="text-xs font-semibold tracking-wide text-espresso hover:text-cherry transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cherry transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory border border-stone-warm text-xs font-bold text-cherry-dark hover:border-cherry hover:bg-champagne-light transition-all shadow-sm"
            >
              <span>Executive Overview</span>
              <ArrowRight className="w-3.5 h-3.5 text-cherry" />
            </Link>

            <Link
              to="/login"
              className="px-3 py-1.5 text-xs font-semibold text-espresso hover:text-cherry transition-colors"
            >
              Sign In
            </Link>

            <Link to="/register">
              <Button
                variant="primary"
                size="sm"
                className="shadow-sm"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link to="/login" className="text-xs font-semibold text-espresso px-2 py-1">
              Sign In
            </Link>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-xl bg-ivory border border-stone-warm text-espresso hover:text-cherry transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileOpen && (
        <div className="sm:hidden bg-ivory border-b border-stone-warm px-4 py-5 shadow-luxury space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="text-sm font-semibold text-espresso hover:text-cherry py-1.5 border-b border-stone-warm/40"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link to="/dashboard" onClick={() => setIsMobileOpen(false)}>
              <Button variant="primary" className="w-full text-xs shadow-luxury" icon={ArrowRight}>
                Enter Executive Overview
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setIsMobileOpen(false)}>
                <Button variant="secondary" className="w-full text-xs">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileOpen(false)}>
                <Button variant="secondary" className="w-full text-xs">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
