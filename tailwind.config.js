/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f8',
          100: '#d7e0ee',
          200: '#aec0dd',
          300: '#7f9ac8',
          400: '#4f70a9',
          500: '#2f4d85',
          600: '#1f3868',
          700: '#162a51',
          800: '#0f1e3d', // primary deep navy
          900: '#0a1530',
          950: '#060d1e',
        },
        teal: {
          50: '#eefaf7',
          100: '#d3f2ea',
          200: '#a6e5d5',
          300: '#71d3bd',
          400: '#3fbea3', // soft teal accent
          500: '#28a58c',
          600: '#1e8471',
          700: '#1a695c',
          800: '#18534a',
          900: '#15453e',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dde1e8',
          300: '#c3c9d4',
          400: '#98a1b3',
          500: '#71798d',
          600: '#565d70',
          700: '#454a5a',
          800: '#2f3340',
          900: '#1c1e27',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 30, 61, 0.06), 0 1px 2px rgba(15, 30, 61, 0.04)',
        card: '0 4px 20px rgba(15, 30, 61, 0.07)',
        lift: '0 12px 32px rgba(15, 30, 61, 0.12)',
      },
      backgroundImage: {
        'mindora-gradient': 'linear-gradient(135deg, #0f1e3d 0%, #16305c 55%, #1a695c 100%)',
        'mindora-soft': 'linear-gradient(135deg, #eefaf7 0%, #eef2f8 100%)',
      },
    },
  },
  plugins: [],
}
