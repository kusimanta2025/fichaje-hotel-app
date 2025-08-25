// create-tailwind-config.js
const fs = require('fs');

const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

fs.writeFileSync('tailwind.config.js', config);
console.log('✅ tailwind.config.js creado correctamente');
