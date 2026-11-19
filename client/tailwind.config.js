/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B0F19',
          900: '#101827', // Official Sidebar & dark accent
          800: '#1E293B',
          700: '#334155',
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Primary brand blue
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9', // Secondary sky blue
          600: '#0284C7',
          700: '#0369A1',
        },
        silver: {
          50: '#F8FAFC',
          100: '#F5F7FA', // Main background
          200: '#E2E8F0', // Main border
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Secondary text
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#111827', // Primary text
        },
        charcoal: { DEFAULT: '#242424', 900: '#1b1b1b', 800: '#242424', 700: '#2e2e2e', 600: '#3a3a3a' },
        cream: { DEFAULT: '#F7F3EA', 100: '#FBF9F4', 200: '#F7F3EA', 300: '#EFE8D8' },
        orange: { 50: '#FDF3EA', 100: '#FBE4CF', 400: '#EE9C55', 500: '#E88735', 600: '#D0731F', 700: '#A95A15' },
        ink: { DEFAULT: '#252525', muted: '#737373' },
        mist: '#F1F2F4',
      },
      boxShadow: { card: '0 1px 2px rgba(36,36,36,.04), 0 2px 8px rgba(36,36,36,.05)' },
    },
  },
  plugins: [],
}
