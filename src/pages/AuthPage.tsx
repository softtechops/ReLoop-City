import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore, UserProfile } from '../store/useStore';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowLeft,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';

interface AuthPageProps {
  defaultMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode = 'login' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : defaultMode;
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('Municipal Officer');
  const [errorMessage, setErrorMessage] = useState('');

  const { login, signup } = useStore();

  const triggerSuccessAndRedirect = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#059669', '#10B981', '#0F3E6D', '#D97706'],
      });
    } catch {
      // Confetti fallback safely ignored
    }

    setTimeout(() => {
      // Navigate to the website as requested by the user
      navigate('/');
    }, 700);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your municipal email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login({
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Municipal Officer',
        organization: 'Pimpri Chinchwad Municipal Corporation (PCMC)',
        role: 'Authorized Municipal User',
      });
      setIsLoading(false);
      triggerSuccessAndRedirect();
    }, 500);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        name: fullName,
        email,
        organization: organization || 'Pimpri Chinchwad Municipal Corporation (PCMC)',
        role,
      };
      signup(newUser);
      setIsLoading(false);
      triggerSuccessAndRedirect();
    }, 500);
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = (demoRole: 'officer' | 'judge') => {
    setIsLoading(true);
    setTimeout(() => {
      if (demoRole === 'officer') {
        login({
          name: 'Aditi Sharma',
          email: 'aditi.sharma@pcmcindia.gov.in',
          role: 'Municipal Commissioner / Zone A Lead',
          organization: 'PCMC Urban Environment Cell',
        });
      } else {
        login({
          name: 'Grand Challenge Evaluator',
          email: 'judge@pccoe-grandchallenge.org',
          role: 'Competition Jury & Climate Track Evaluator',
          organization: 'PCCOE Grand Challenge 2026',
        });
      }
      setIsLoading(false);
      triggerSuccessAndRedirect();
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Top Header Strip */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-charcoal-200/70 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 rounded-xl"
        >
          <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center text-white font-bold shadow-sm">
            <svg
              className="w-4 h-4 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-navy-900 font-heading">
            ReLoop <span className="text-emerald-600">City</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-600 hover:text-navy-900 px-3 py-1.5 rounded-xl border border-charcoal-200 hover:border-charcoal-300 bg-white transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Skip to Website</span>
        </Link>
      </header>

      {/* Main Authentication Grid */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-auto">
        <div className="w-full max-w-5xl rounded-3xl bg-white border border-charcoal-300 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 ring-1 ring-charcoal-900/5">
          
          {/* Left Brand & Context Side (Navy Visual Experience) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-8 sm:p-10 flex flex-col justify-between blueprint-grid-dark relative overflow-hidden">
            
            {/* Ambient circular loop backdrop glow */}
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-amberGold-500/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Smart Cities AI Platform</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
                  Welcome to the Circular Future.
                </h1>
                <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                  Sign in or create a municipal profile to access the 7-step AI waste-to-energy circular simulation platform.
                </p>
              </div>

              {/* 3 Impact Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">95.2% Landfill Diversion</span>
                    <span className="text-[11px] text-charcoal-400 block">AI optical sorting & biomethanation</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-amberGold-500/20 text-amberGold-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">7-Step Closed AI Loop</span>
                    <span className="text-[11px] text-charcoal-400 block">Sense → Predict → Optimize → Report</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-navy-500/30 text-teal-300 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Pune PCMC Pilot Data</span>
                    <span className="text-[11px] text-charcoal-400 block">PCCOE Grand Challenge 2026</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Quote & Trust Stamp */}
            <div className="relative z-10 pt-8 border-t border-white/10 mt-6">
              <p className="text-[11px] text-charcoal-400 italic">
                "Turning municipal waste from an expensive disposal cost center into a renewable revenue engine."
              </p>
              <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-1">
                Zero-Backend · Browser-Deterministic Engine
              </span>
            </div>

          </div>

          {/* Right Form Side */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Tab Selector: Sign In vs Create Account */}
              <div className="flex items-center p-1 bg-charcoal-100 rounded-2xl max-w-sm mb-6 border border-charcoal-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'login'
                      ? 'bg-white text-navy-900 shadow-xs'
                      : 'text-charcoal-600 hover:text-navy-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-navy-900 shadow-xs'
                      : 'text-charcoal-600 hover:text-navy-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-navy-900 font-heading">
                  {mode === 'login' ? 'Sign in to your account' : 'Register municipal terminal'}
                </h2>
                <p className="text-xs text-charcoal-600 mt-1">
                  {mode === 'login'
                    ? 'Enter your credentials to manage city telemetry and view the website.'
                    : 'Create a new account to test circular forecasting and route optimization.'}
                </p>
              </div>

              {/* Error Callout */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SIGN IN FORM */}
              {/* ========================================================================= */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="auth-email" className="block text-xs font-bold text-charcoal-700">
                      Official / Municipal Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer@pcmcindia.gov.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-sm text-charcoal-900 placeholder-charcoal-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="auth-password" className="block text-xs font-bold text-charcoal-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Demo mode: you can use any sample password or use the 1-Click Demo buttons below!')}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-charcoal-200 bg-white text-sm text-charcoal-900 placeholder-charcoal-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400 hover:text-navy-900"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-charcoal-300"
                      />
                      <span className="text-xs text-charcoal-600 font-medium">
                        Remember this municipal workstation
                      </span>
                    </label>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-sm shadow-md shadow-navy-900/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ring-1 ring-white/10"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating terminal...</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Sign In & Move to Website</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              ) : (
                /* ========================================================================= */
                /* SIGN UP FORM */
                /* ========================================================================= */
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label htmlFor="signup-name" className="block text-xs font-bold text-charcoal-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Sneha Patil"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-charcoal-200 bg-white text-sm text-charcoal-900 placeholder-charcoal-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="signup-email" className="block text-xs font-bold text-charcoal-700">
                      Work / Municipal Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="s.patil@pcmcindia.gov.in"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-charcoal-200 bg-white text-sm text-charcoal-900 placeholder-charcoal-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Role & Organization Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="signup-role" className="block text-xs font-bold text-charcoal-700">
                        Municipal Role
                      </label>
                      <select
                        id="signup-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-charcoal-200 bg-white text-xs font-semibold text-charcoal-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-2xs"
                      >
                        <option value="Municipal Officer">Municipal Officer (PCMC)</option>
                        <option value="Competition Judge">Grand Challenge Jury</option>
                        <option value="Plant Engineer">MRF Plant Engineer</option>
                        <option value="Sustainability Lead">Sustainability Lead</option>
                        <option value="Urban Planner">Urban Infrastructure Planner</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="signup-org" className="block text-xs font-bold text-charcoal-700">
                        Organization / Ward
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        <input
                          id="signup-org"
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="PCMC Zone A"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-charcoal-200 bg-white text-xs text-charcoal-900 placeholder-charcoal-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label htmlFor="signup-password" className="block text-xs font-bold text-charcoal-700">
                      Create Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-2 rounded-xl border border-charcoal-200 bg-white text-sm text-charcoal-900 placeholder-charcoal-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-400 hover:text-navy-900"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <p className="text-[11px] text-charcoal-500 pt-1">
                    By registering, you agree to access client-side deterministic simulation telemetry calibrated to the PCMC pilot sector.
                  </p>

                  {/* Primary Signup Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ring-1 ring-white/10"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating profile...</span>
                      </span>
                    ) : (
                      <>
                        <BadgeCheck className="w-4 h-4 text-white" />
                        <span>Create Account & Move to Website</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* 1-Click Instant Demo Login Strip */}
              <div className="mt-6 pt-5 border-t border-charcoal-200">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal-500 block mb-2 text-center">
                  Quick 1-Click Evaluation Access:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('officer')}
                    className="p-2.5 rounded-xl border border-charcoal-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 text-xs font-semibold text-charcoal-800 flex items-center justify-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    <span>Login as Municipal Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('judge')}
                    className="p-2.5 rounded-xl border border-charcoal-200 hover:border-amberGold-400 bg-white hover:bg-amberGold-50/40 text-xs font-semibold text-charcoal-800 flex items-center justify-center gap-1.5 transition-all shadow-2xs group cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-amberGold-500 group-hover:scale-125 transition-transform" />
                    <span>Login as Competition Judge</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Switch Mode / Skip link */}
            <div className="pt-2 text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-charcoal-500 hover:text-navy-900 inline-flex items-center gap-1 hover:underline"
              >
                <span>Skip authentication and explore public website directly</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Footer Strip */}
      <footer className="w-full bg-white border-t border-charcoal-200 px-4 py-3 text-center text-xs text-charcoal-500">
        <p>
          PCCOE International Grand Challenge 2026 · AI for Climate Change · ReLoop City Municipal Platform
        </p>
      </footer>

    </div>
  );
};
