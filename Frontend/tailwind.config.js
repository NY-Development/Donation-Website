const config = {
  content: [
    './index.html',       // Vite's root HTML
    './src/**/*.{ts,tsx}', // All TSX/TS files in src
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#7f13ec',
        'primary-hover': '#6b10c6',
        'background-light': '#f7f6f8',
        'background-dark': '#191022',
        'surface-light': '#ffffff',
        'surface-dark': '#251b2e',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Forms plugin
    require('@tailwindcss/container-queries'), // Container queries plugin
  ],
};

export default config;