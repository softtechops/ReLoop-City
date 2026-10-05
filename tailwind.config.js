/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--page)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        line: 'var(--line)',
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        'fg-subtle': 'var(--fg-subtle)',
        'ring-focus': 'var(--ring-focus)',
        background: 'var(--page)',
        cc: {
          0: '#060B14',
          1: '#0B1220',
          2: '#111827',
          glass: 'rgba(255,255,255,0.05)',
        },
        brand: {
          navy: '#12305C',
          sage: '#7BA17D',
          amber: '#D9A441',
          charcoal: '#2F3437',
          offWhite: '#F7F6F2',
        },
        navy: {
          50: '#F0F5FA',
          100: '#E1EDF7',
          200: '#C2DCF0',
          300: '#94C2E4',
          400: '#5F9FD4',
          500: '#2A76B8',
          600: '#175997',
          700: '#0F3E6D',
          800: '#12305C',
          900: '#0A1E35',
          950: '#061324',
        },
        sage: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#7BA17D',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        amberGold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#D9A441',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#2F3437',
          800: '#1E293B',
          900: '#0F172A',
        },
        residual: {
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'Sora', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Sora', 'Outfit', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'JetBrains Mono', 'Fira Code', 'monospace']
      },
      fontSize: {
        'hero-kpi': ['clamp(3.5rem, 6vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin-reverse 35s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 18s ease-in-out infinite',
        'shine': 'shine 2.4s linear infinite',
        'glow-pulse': 'glowPulse 2.4s ease-in-out infinite',
        'ticker': 'ticker 28s linear infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
        'stagger-in': 'staggerIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        'spin-reverse': {
          to: { transform: 'rotate(-360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(-8%, -4%, 0) scale(1.05)', opacity: '0.55' },
          '50%': { transform: 'translate3d(8%, 6%, 0) scale(1.12)', opacity: '0.85' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scan: {
          '0%': { transform: 'translateY(-20%)' },
          '100%': { transform: 'translateY(220%)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '30%': { transform: 'translate(3%, 1%)' },
          '50%': { transform: 'translate(-1%, 2%)' },
          '70%': { transform: 'translate(2%, -1%)' },
          '90%': { transform: 'translate(-3%, 2%)' },
        },
        staggerIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'blueprint': '0 4px 20px -2px rgba(10, 30, 53, 0.05), 0 2px 6px -1px rgba(10, 30, 53, 0.03)',
        'blueprint-lg': '0 12px 32px -4px rgba(10, 30, 53, 0.10), 0 4px 12px -2px rgba(10, 30, 53, 0.05)',
        'glow-sage': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-emerald': '0 0 32px -4px rgba(52, 211, 153, 0.55)',
        'glow-cyan': '0 0 28px -4px rgba(34, 211, 238, 0.45)',
        'glass': '0 8px 32px 0 rgba(15, 62, 109, 0.08)',
        'cc': '0 18px 50px -24px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('cc', '.command-center &');
      addVariant('present', '.presentation-mode &');
    }
  ],
}
