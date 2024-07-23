module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'claude-bg': '#F7F7F8',
        'claude-text': '#40414F',
        'claude-subtext': '#6E6E80',
        'claude-green': '#10A37F',
        'claude-red': '#FF4D4F',
        'claude-blue': '#3B82F6',
        'claude-yellow': '#FBBF24',
        'claude-purple': '#8B5CF6',
      },
    },
  },
  plugins: [],
}