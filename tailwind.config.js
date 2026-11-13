/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Egyptian wall-pigment palette. Legacy token names are kept so the
           rest of the interface keeps working while it is re-skinned. */
        lapis: {
          950: '#081531',
          900: '#0D1F4C',
          800: '#12295F',
          700: '#1A3A85',
          600: '#234A9E',
        },
        limestone: {
          50: '#F7F3E9',
          100: '#EDE7D8',
          200: '#D9D1BE',
          300: '#BDB39C',
          400: '#948C79',
        },
        ochre: {
          200: '#F3D08A',
          300: '#EFC163',
          400: '#E3A92F',
          500: '#C48F1F',
          600: '#96700F',
        },
        malachite: '#3FA878',
        carnelian: {
          DEFAULT: '#D8452F',
          300: '#EE8A76',
        },
        amber: '#F28C28',

        void: {
          950: '#081531',
          900: '#0D1F4C',
          850: '#102454',
          800: '#12295F',
          700: '#1A3A85',
          600: '#234A9E',
          500: '#2C57B4',
        },
        royal: {
          300: '#9FB6E8',
          400: '#6F8FD8',
          500: '#4A6DC4',
          600: '#31509F',
          700: '#1A3A85',
        },
        gold: {
          300: '#F3D08A',
          400: '#E3A92F',
          500: '#C48F1F',
          600: '#96700F',
        },
        danger: '#D8452F',
        warn: '#F28C28',
        good: '#3FA878',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Reem Kufi"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        latin: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['17px', { lineHeight: '1.8' }],
        sm: ['15px', { lineHeight: '1.75' }],
        xs: ['13px', { lineHeight: '1.65' }],
      },
      borderRadius: {
        data: '2px',
        window: '8px',
      },
      boxShadow: {
        sheet: '0 1px 0 0 #1A3A85',
      },
      backgroundImage: {
        'drawing-grid':
          'linear-gradient(rgba(237,231,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(237,231,216,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid8: '8px 8px',
      },
      keyframes: {
        trace: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        launch: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        settle: {
          '0%': { opacity: '0', transform: 'translateY(-3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        trace: 'trace 1400ms cubic-bezier(.4,0,.2,1) both',
        launch: 'launch 420ms ease-out both',
        settle: 'settle 220ms ease-out both',
      },
    },
  },
  plugins: [],
};
