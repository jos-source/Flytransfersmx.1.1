/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");

module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1240px',
        '2xl': '1400px',
      },
    },

    extend: {
      colors: {
        primary: "#D4AF37",
        secondary: "#000000",
        arena: "#FFF9F0",
        dorada: "#D4AF37",
        marino: "#1A1A2E",
        900: '#1A1A2E',
        negro: "#121212",
        sombra: "#2C3E50",
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
        button: "8px",
      },
      fontFamily: {
        inconsolata: ['Inconsolata', 'monospace'],
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
}
