/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        "primary-light": "var(--primary-light-color)",
        "primary-hover": "var(--primary-hover-color)",
        secondary: "var(--secondary-color)",
        "secondary-dark": "var(--secondary-dark-color)",
        accent: "var(--accent-color)",
        "accent-hover": "var(--accent-hover-color)",
        background: "var(--background-color)",
        surface: "var(--surface-color)",
        error: "var(--error-color)",
        success: "var(--success-color)",
      },
    },
  },
  plugins: [],
};
