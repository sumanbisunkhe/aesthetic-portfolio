/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#000000', // Pure black
          800: '#1a1a1a',
          700: '#333333',
          600: '#4d4d4d',
          500: '#666666',
          400: '#808080',
          300: '#999999',
          200: '#b3b3b3',
          100: '#cccccc',
          50: '#ffffff',  // Pure white
        },
        royal: {
          900: '#1a237e', // Deep royal blue
          800: '#283593',
          700: '#303f9f',
          600: '#3949ab',
          500: '#3f51b5',
          400: '#5c6bc0',
          300: '#7986cb',
          200: '#9fa8da',
          100: '#c5cae9',
          50: '#e8eaf6',
        },
        accent: {
          900: '#ffd700', // Pure gold/yellow
          800: '#ffdb1a',
          700: '#ffdf33',
          600: '#ffe34d',
          500: '#ffe766',
          400: '#ffeb80',
          300: '#ffef99',
          200: '#fff3b3',
          100: '#fff7cc',
          50: '#fffbe6',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a5b3a5',
          400: '#839483',
          500: '#687768',
          600: '#525f52',
          700: '#424c42',
          800: '#363e36',
          900: '#2d332d',
        },
        cream: {
          50: '#fdfcfb',
          100: '#f7f3ef',
          200: '#ebe3d9',
          300: '#dfd0bf',
          400: '#cdb7a0',
          500: '#bca088',
          600: '#aa8c74',
        },
        gold: {
          50: '#fdfbea',
          100: '#fbf5c6',
          200: '#f7ea89',
          300: '#f4d852',
          400: '#f2c53d',
          500: '#e6a520',
          600: '#cc7f16',
          700: '#a65c15',
          800: '#884a18',
          900: '#723d19',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        fascinate: ['Fascinate', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
        oldenburg: ['Oldenburg', 'cursive'],
        'merriweather': ['Merriweather', 'serif'],
        inter: ['Inter', 'sans-serif'],
        merriweather: ['Merriweather Sans', 'sans-serif'],
        piedra: ['Piedra', 'cursive'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.1), 0 10px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px -5px rgba(26, 35, 126, 0.3)',
        'gold': '0 0 20px -5px rgba(255, 215, 0, 0.3)',
      }
    },
  },
  plugins: [],
} 