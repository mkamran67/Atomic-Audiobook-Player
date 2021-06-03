module.exports = {
  // mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkest: "#111111",
        foreground: "#1D1D1D",
        "btn-color": "#BB86FC",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
