/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'xxs' : '320px',   // Extra small phones
        'xs': '375px',    // iPhone SE and small phones
        'sm': '640px',    // Small tablets
        'md': '768px',    // Medium tablets
        'lg': '1024px',   // Laptops
        'xl': '1280px',   // Desktop
        '2xl': '1536px',  // Large desktop
      },
      spacing: {
        '0.25': '0.0625rem',  // 1px
        '0.75': '0.1875rem',  // 3px
        '1.25': '0.3125rem',  // 5px
        '1.5': '0.375rem',    // 6px
        '1.75': '0.4375rem',  // 7px
        '2.25': '0.5625rem',  // 9px
        '2.75': '0.6875rem',  // 11px
        '3.25': '0.8125rem',  // 13px
        '4.5': '1.125rem',    // 18px
        '5.5': '1.375rem',    // 22px
      },
      fontSize: {
        '3xs': '0.5rem',      // 8px - very small mobile text
        '2xs': '0.625rem',    // 10px - small mobile text
        'xs': '0.75rem',      // 12px - mobile body text
        'sm': '0.875rem',     // 14px - mobile headers
        'base': '1rem',       // 16px - default
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
        '6xl': '3.75rem',     // 60px
        '7xl': '4.5rem',      // 72px
        '8xl': '6rem',        // 96px
        '9xl': '8rem',        // 128px
      },
      colors: {
        "ku-primary": {
          DEFAULT: "#051D35",
          light: "#006C67",
          dark: "#54CF90",
        },
        primary: {
          DEFAULT: "#006C67",
          dark: "#54CF90",
        },
      },
      fontFamily: {
        'sans': ['Kanit', 'Mitr', 'Nunito', 'Quicksand', 'system-ui', 'sans-serif'],
        'cute': ['Mitr', 'Kanit', 'Nunito Sans', 'system-ui', 'sans-serif'],
        'round': ['Comfortaa', 'Quicksand', 'Varela Round', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "floating": "floating 8s ease-in-out infinite",
        "bounce-gentle": "bounce 2s infinite",
      },
      keyframes: {
        floating: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 1 },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mobile": "linear-gradient(135deg, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'mobile': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'mobile-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        'glass': '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
        'glass-strong': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'card-mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'mobile': '0.5rem',   // 8px
        'card': '0.75rem',    // 12px
      },
      minHeight: {
        'mobile-card': '200px',
        'mobile-card-sm': '180px',
      },
      maxWidth: {
        'mobile': '100vw',
        'mobile-content': 'calc(100vw - 2rem)',
      },
      zIndex: {
        'mobile-header': '1000',
        'mobile-overlay': '1001',
        'mobile-modal': '1002',
      }
    },
    fontFamily: {
      'sans': ['Kanit', 'Mitr', 'Nunito', 'Quicksand', 'system-ui', 'sans-serif'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
    },
  },
  plugins: [],
};