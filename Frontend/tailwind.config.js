import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors (Trust & Compassion)
        primary: {
          light: '#9D7BFF',   // Soft Purple
          DEFAULT: '#6D28D9', // Deep Violet
          dark: '#4C1D95',    // Rich Purple
        },
        // Accent Colors (Success & Confirmation)
        accent: {
          success: '#10B981', // Soft Green
          gold: '#F59E0B',    // Impact/Highlight
          glow: '#A78BFA',    // For 3D/Futuristic glow effects
        },
        // Neutral Palette (Clarity & Cleanliness)
        background: {
          light: '#F9FAFB',   // Light Gray
          DEFAULT: '#FFFFFF',  // White
          glass: 'rgba(255, 255, 255, 0.7)', // Glassmorphism base
        },
        // UI Text Colors
        surface: {
          heading: '#111827', // Deep Gray/Black
          body: '#4B5563',    // Readable Gray
          muted: '#9CA3AF',   // Subtle text
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'], // Professional & Accessible
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(109, 40, 217, 0.3)', // Futuristic glow
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',     // Glassmorphism shadow
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      gradientColorStops: {
        'primary-gradient': ['#4C1D95', '#6D28D9', '#9D7BFF'], // For hero/3D effects
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Keep form styling consistent
  ],
  darkMode: 'class', // Optional: dark mode support
})