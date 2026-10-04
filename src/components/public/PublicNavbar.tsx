import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReloopLogo } from '../brand/ReloopLogo';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Live Simulation', href: '#preview' },
    { label: 'Statistics', href: '#statistics' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 transition-all">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Official Reloop Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-green-600 rounded-lg py-1"
            aria-label="Reloop City - Homepage"
          >
            <ReloopLogo className="h-7 sm:h-8" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Website sections">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-green-600 font-medium text-sm transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Primary Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium text-sm shadow-md shadow-green-500/20 hover:shadow-lg transition-all cursor-pointer min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Launch Live App</span>
              <ArrowRight className="w-4 h-4 text-white/90" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-green-600 hover:bg-gray-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-2 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50/50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 px-2">
              <Link
                to="/app/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm shadow-md"
              >
                <span>Launch Live App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
