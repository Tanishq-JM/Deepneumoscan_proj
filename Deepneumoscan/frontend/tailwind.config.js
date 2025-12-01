/** @type {import('tailwindcss').Config} */
export default {
  
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
       backgroundImage: {
        'medical': "url('/assets/medical-bg.jpg')",
      },
    },
  },
  plugins: [],
  
}
