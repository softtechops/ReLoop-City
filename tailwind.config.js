/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F6F2',
        navy: {
          50: '#F0F4FA',
          100: '#D9E4F2',
          200: '#B0C8E3',
          300: '#7FA7D1',
          400: '#4D84BE',
          500: '#2762A7',
          600: '#1A4983',
          700: '#12305C', // Municipal Primary Navy
          800: '#0C203F',
          900: '#071325',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E5ECE5',
          200: '#CBD8CB',
          300: '#AEC2AE',
          400: '#8FAA90',
          500: '#7BA17D', // Sage green (organic/recycling)
          600: '#5F8461',
          700: '#476549',
          800: '#324733',
        },
        amberGold: {
          50: '#FDFBF5',
          100: '#FAF3E2',
          200: '#F4E5BD',
          300: '#EDD492',
          400: '#E4BF64',
          500: '#D9A441', // Amber/gold (energy recovery)
          600: '#B88225',
          700: '#8F6116',
          800: '#66430B',
        },
        charcoal: {
          50: '#F6F7F7',
          100: '#E7E9E9',
          200: '#CFD3D4',
          300: '#A9AFB1',
          400: '#757E81',
          500: '#545C5F',
          600: '#3F4649',
          700: '#2F3437', // Charcoal primary text
          800: '#232729',
          900: '#171A1B',
        },
        residual: {
          400: '#A0A5AA',
          500: '#8E9296',
          600: '#73777B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'blueprint': '0 4px 20px -2px rgba(18, 48, 92, 0.08), 0 2px 6px -1px rgba(18, 48, 92, 0.04)',
        'blueprint-lg': '0 10px 30px -4px rgba(18, 48, 92, 0.12), 0 4px 10px -2px rgba(18, 48, 92, 0.06)',
        'glow-sage': '0 0 15px -3px rgba(123, 161, 125, 0.4)',
        'glow-amber': '0 0 15px -3px rgba(217, 164, 65, 0.4)',
      }
    },
  },
  plugins: [],
}
