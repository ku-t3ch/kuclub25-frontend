/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      spacing: {
        '1.25': '0.3125rem',
        '1.5': '0.375rem',
        '1.75': '0.4375rem',
        '2.25': '0.5625rem',
        '2.75': '0.6875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      colors: {
        "ku-primary": {
          DEFAULT: "#051D35",
          light: "#0A1C30",
          dark: "#041628",
        },
        primary: {
          DEFAULT: "#006C67",
          dark: "#051D35",
        },
      },
      fontFamily: {
        'sans': ['Kanit', 'Mitr', 'Nunito', 'Quicksand', 'system-ui', 'sans-serif'],
        'cute': ['Mitr', 'Kanit', 'Nunito Sans', 'system-ui', 'sans-serif'],
        'round': ['Comfortaa', 'Quicksand', 'Varela Round', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
    },
    fontFamily: {
      'sans': ['Kanit', 'Mitr', 'Nunito', 'Quicksand', 'system-ui', 'sans-serif'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
    },
  },
  plugins: [],
};