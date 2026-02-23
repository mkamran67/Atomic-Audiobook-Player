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
          "primary": "#8B7EC8",
          "secondary": "#5EADAD",
          "accent": "#D4A574",
          "neutral": "#1E1B2E",
          "base-100": "#13111C",
          "base-200": "#1A1726",
          "base-300": "#252136",
          "base-content": "#E2DFF0",
          "info": "#7CC4E4",
          "success": "#5CB85C",
          "warning": "#D4A574",
          "error": "#D9534F",
        },
      },
      {
        atomicLight: {
          "primary": "#6C5BAE",
          "secondary": "#3D8B8B",
          "accent": "#B8834A",
          "neutral": "#D5D0E6",
          "base-100": "#FFFFFF",
          "base-200": "#F0ECF8",
          "base-300": "#DDD8EB",
          "base-content": "#1E1B2E",
          "info": "#4BA3CC",
          "success": "#3D8B3D",
          "warning": "#B8834A",
          "error": "#C9302C",
        },
      },
      {
        custom: {
          "primary": "#8B7EC8",
          "secondary": "#5EADAD",
          "accent": "#D4A574",
          "neutral": "#1E1B2E",
          "base-100": "#13111C",
          "base-200": "#1A1726",
          "base-300": "#252136",
          "base-content": "#E2DFF0",
          "info": "#7CC4E4",
          "success": "#5CB85C",
          "warning": "#D4A574",
          "error": "#D9534F",
        },
      },
    ],
  }
};
