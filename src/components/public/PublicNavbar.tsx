import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReloopLogo } from '../brand/ReloopLogo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Menu, X, ArrowRight } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Impact', href: '#statistics' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 w-full bg-surface/90 dark:bg-surface/85 backdrop-blur-md border-b border-line z-50 transition-all">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg py-1"
            aria-label="ReLoop City — Homepage"
          >
            <ReloopLogo className="h-7 sm:h-8" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Website sections">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-fg-muted hover:text-fg font-medium text-sm transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Theme Toggle + CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/app/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <span>Launch live demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-line py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-3 text-base font-medium text-fg-muted hover:text-fg hover:bg-surface-muted rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 px-1">
              <Link
                to="/app/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors min-h-[44px]"
              >
                <span>Launch live demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
