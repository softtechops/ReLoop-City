import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Problem', href: '#problem' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Live Preview', href: '#preview' },
    { label: 'AI in Action', href: '#ai-in-action' },
    { label: 'Impact', href: '#impact' },
    { label: 'Revenue', href: '#revenue' },
    { label: 'Roadmap', href: '#roadmap' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-charcoal-200/70 shadow-xs transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 rounded-xl p-1"
          aria-label="ReLoop City - Public Homepage"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-800 to-navy-600 flex items-center justify-center text-white font-bold shadow-md shadow-navy-900/20 group-hover:scale-105 transition-all">
            <svg
              className="w-5 h-5 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-navy-900 font-heading block leading-none">
              ReLoop <span className="text-sage-600">City</span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-500 block mt-0.5">
              Circular Municipal Platform
            </span>
          </div>
        </Link>

        {/* Desktop Anchor Navigation */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Website sections">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-charcoal-700 hover:text-navy-900 hover:scale-105 transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sage-600 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Primary CTA: Launch Live Demo */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-navy-800 to-navy-900 hover:from-navy-900 hover:to-navy-950 text-white font-bold text-sm shadow-md shadow-navy-900/25 hover:shadow-lg hover:shadow-navy-900/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer ring-1 ring-white/20"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Launch Live Demo</span>
            <ArrowRight className="w-4 h-4 text-white/80" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="lg:hidden p-2 rounded-xl border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-charcoal-200 px-5 py-5 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-charcoal-800 hover:text-sage-600 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-charcoal-200">
            <Link
              to="/app/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-900 text-white font-bold text-sm shadow-md shadow-navy-900/25"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
