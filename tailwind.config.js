/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'], // Add the Outfit font
      },
      boxShadow: {
        'custom': '4px 4px 52.2px rgba(0, 0, 0, 0.09)',
        'custom-green': '0px 10px 41.8px -2px rgba(99, 228, 0, 0.34)',
      },
      backgroundImage: {
        'custom-pattern': "url('./imageforbg.png')",
        'logo': "url('./passwordlogo.png')",
        'custom-gradient': 'linear-gradient(to right top, #051937, #001944, #00174f, #00155a, #000f64)',
      },


    },
  },
  plugins: [],
}

