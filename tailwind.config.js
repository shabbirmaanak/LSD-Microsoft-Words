/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        word: {
          blue: '#107c41', // Word theme header green/blue style or Office blue #0078d4
          header: '#106ebe',
          ribbonBg: '#f3f2f1',
          ribbonHover: '#e1dfdd',
          ribbonActive: '#ffffff',
          paper: '#ffffff',
          paperBg: '#e8ecef',
          darkText: '#323130',
        }
      },
      fontFamily: {
        office: ['Calibri', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 4px 16px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
