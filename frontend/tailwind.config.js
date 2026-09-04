/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/views/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        chillax: ["Chillax-Regular"],
        "chillax-bold": ["Chillax-Bold"],
        "chillax-medium": ["Chillax-Medium"],
        "chillax-semibold": ["Chillax-Semibold"],
      },
    },
  },
  plugins: [],
};