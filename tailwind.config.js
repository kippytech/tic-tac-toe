/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'congrats-animation': 'congrats-animation 5s ease-in-out 2s 3',
      },
      keyframes: {
        'congrats-animation': {
          '0%': {transform: 'scale(1) rotate(0deg)'},
          '50%': {transform: 'scale(1.5) rotate(180deg)'},
          '100%': {transform: 'scale(1) rotate(360deg)'},
        },
      },
    },
  },
  plugins: [],
}

