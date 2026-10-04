/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
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
          800: '#12305C', // Brand Navy
          900: '#0A1E35', // Deep Executive Sapphire Navy
          950: '#061324',
        },
        sage: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#7BA17D', // Brand Sage
          400: '#34D399',
          500: '#10B981', // Vibrant Bio-Emerald
          600: '#059669', // Rich Eco Green
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        amberGold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#D9A441', // Brand Amber
          400: '#FBBF24',
          500: '#F59E0B', // Solar Amber
          600: '#D97706',
          700: '#B45309', // High contrast text
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
          700: '#2F3437', // Brand Charcoal
          800: '#1E293B',
          900: '#0F172A', // Slate 900
        },
        residual: {
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin-reverse 35s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'spin-reverse': {
          to: { transform: 'rotate(-360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'blueprint': '0 4px 20px -2px rgba(10, 30, 53, 0.05), 0 2px 6px -1px rgba(10, 30, 53, 0.03)',
        'blueprint-lg': '0 12px 32px -4px rgba(10, 30, 53, 0.10), 0 4px 12px -2px rgba(10, 30, 53, 0.05)',
        'glow-sage': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glass': '0 8px 32px 0 rgba(15, 62, 109, 0.08)',
      }
    },
  },
  plugins: [],
}
