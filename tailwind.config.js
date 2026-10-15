/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#101318',
          800: '#141920',
          700: '#171D25',
          600: '#1C2430',
          500: '#28313D',
        },
        accent: {
          DEFAULT: '#3478F6',
          hover: '#2B68D9',
          muted: '#1E3A6E',
        },
        text: {
          primary: '#F1F4F8',
          secondary: '#9CA7B5',
          muted: '#6B7585',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
      }
    },
  },
  plugins: [],
}