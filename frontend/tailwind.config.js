/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B161C',
          900: '#0F1E26',
          800: '#152A33',
          700: '#1D3841',
          600: '#2A4B54',
        },
        paper: '#EDF1F0',
        muted: '#9FB3B8',
        gold: {
          400: '#E3B450',
          500: '#D9A441',
          600: '#B8862E',
        },
        gain: {
          400: '#6FC099',
          500: '#4FA37D',
          600: '#3A8064',
        },
        loss: {
          400: '#EB8676',
          500: '#E2604F',
          600: '#C24738',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
