module.exports = {
  purge: ["./pages/**/*.js", "./pages/**/*.md", "./components/**/*.js"],
  important: true,
  theme: {
    extend: {
      spacing: {
        "1/2": "50%",
        full: "100%",
      },
    },
  },
  variants: {},
  plugins: [],
};
