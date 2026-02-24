/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms'),
  ],
  daisyui: {
    themes: [
      {
        atomicDark: {
          "primary": "#A78BFA",
          "secondary": "#34D399",
          "accent": "#FB923C",
          "neutral": "#1A1A2E",
          "base-100": "#0F0F1A",
          "base-200": "#161625",
          "base-300": "#1F1F35",
          "base-content": "#E8E6F0",
          "info": "#67C3F3",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      {
        atomicLight: {
          "primary": "#7C3AED",
          "secondary": "#059669",
          "accent": "#EA580C",
          "neutral": "#E2E0EC",
          "base-100": "#FAFAFE",
          "base-200": "#F0EEF8",
          "base-300": "#E0DDEE",
          "base-content": "#1C1B2E",
          "info": "#2196F3",
          "success": "#16A34A",
          "warning": "#D97706",
          "error": "#DC2626",
        },
      },
      {
        custom: {
          "primary": "#A78BFA",
          "secondary": "#34D399",
          "accent": "#FB923C",
          "neutral": "#1A1A2E",
          "base-100": "#0F0F1A",
          "base-200": "#161625",
          "base-300": "#1F1F35",
          "base-content": "#E8E6F0",
          "info": "#67C3F3",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  }
};
