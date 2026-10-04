import React from 'react';
import { Link } from 'react-router-dom';
import { ReloopLogo } from '../brand/ReloopLogo';
import { MapPin, Phone, Mail, ExternalLink, Heart } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-6">
            <ReloopLogo className="h-8 w-auto" isDark={true} />
            <p className="text-gray-300 text-sm leading-relaxed">
              India's leading digital platform for responsible e-waste and municipal resource circularity. Turn urban waste into clean energy and verified rewards while protecting our ecosystems.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://www.facebook.com/profile.php?id=61574931311764"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://x.com/reloop_today"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/relooptoday/?hl=en"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/reloop-today/?viewAsMember=true"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">Quick Links</h4>
            <nav className="flex flex-col space-y-2.5 text-sm">
              <a href="#home" className="text-gray-300 hover:text-green-400 transition-colors">Home</a>
              <a href="#about" className="text-gray-300 hover:text-green-400 transition-colors">About Us</a>
              <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors">Features & Modules</a>
              <Link to="/app/dashboard" className="text-gray-300 hover:text-green-400 transition-colors">Live Simulation Dashboard</Link>
              <a href="#statistics" className="text-gray-300 hover:text-green-400 transition-colors">Impact Statistics</a>
              <a href="#faq" className="text-gray-300 hover:text-green-400 transition-colors">Frequently Asked Questions</a>
              <Link to="/app/assumptions" className="text-gray-300 hover:text-green-400 transition-colors">Engineering Assumptions</Link>
            </nav>
          </div>

          {/* Column 3: Circular Services */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">Services & Solutions</h4>
            <nav className="flex flex-col space-y-2.5 text-sm">
              <Link to="/app/optimize" className="text-gray-300 hover:text-green-400 transition-colors">Dynamic Fleet Dispatch</Link>
              <Link to="/app/classify" className="text-gray-300 hover:text-green-400 transition-colors">AI Material & Device Valuation</Link>
              <Link to="/app/allocate" className="text-gray-300 hover:text-green-400 transition-colors">Closed-Loop Mass Allocation</Link>
              <Link to="/app/forecast" className="text-gray-300 hover:text-green-400 transition-colors">Biogas & Renewable Electricity</Link>
              <Link to="/app/revenue" className="text-gray-300 hover:text-green-400 transition-colors">EPR Plastic & Carbon Credits</Link>
              <a href="#statistics" className="text-gray-300 hover:text-green-400 transition-colors">Community Collection Drives</a>
            </nav>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">Contact Information</h4>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Plot No: 10-45, Meenakshi Estates,</p>
                  <p>Jeedimetla Village, Medchal District, Telangana - 500015</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">Pilot Zone: PCMC Pune Smart Corridor</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a href="tel:+918977125777" className="hover:text-green-400 transition-colors font-mono">
                  +91 8977125777
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <a href="mailto:info@relooptoday.com" className="hover:text-green-400 transition-colors">
                  info@relooptoday.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 text-center md:text-left">
            <span>© 2026 Reloop. All rights reserved. Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            <span>for a sustainable circular future.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-green-400 transition-colors">Terms &amp; Conditions</a>
            <a href="mailto:info@relooptoday.com" className="hover:text-green-400 transition-colors">Support</a>
            <span className="font-mono text-gray-500">PCCOE Grand Challenge 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
