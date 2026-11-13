/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#050814',
          900: '#070b1a',
          850: '#0a1024',
          800: '#0d1530',
          700: '#121c3d',
          600: '#1a2750',
          500: '#253568',
        },
        royal: {
          300: '#93b4ff',
          400: '#6b93ff',
          500: '#4f7cff',
          600: '#3560e0',
          700: '#2647b0',
        },
        gold: {
          300: '#f4d58a',
          400: '#e8b949',
          500: '#d4a02e',
          600: '#a97a1b',
        },
        danger: '#ff5d6c',
        warn: '#ffc857',
        good: '#38d6a4',
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'Inter', 'system-ui', 'sans-serif'],
        latin: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(79,124,255,.22), 0 10px 40px -18px rgba(79,124,255,.55)',
        gold: '0 0 30px -10px rgba(232,185,73,.5)',
      },
      backgroundImage: {
        'star-field':
          'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.55) 50%, transparent 51%), radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,.4) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 45% 70%, rgba(255,255,255,.35) 50%, transparent 51%), radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,.45) 50%, transparent 51%), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,.3) 50%, transparent 51%)',
      },
      keyframes: {
        drift: {
          '0%,100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 60%' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        drift: 'drift 60s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
      },
    },
  },
  plugins: [],
};
