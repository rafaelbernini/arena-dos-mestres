export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#07041a',
          purple: '#7c3aed',
          green: '#059669',
          blue: '#0891b2',
          amber: '#f59e0b',
          red: '#ef4444',
        }
      },
      fontFamily: { game: ['Orbitron','monospace'] }
    }
  },
  plugins: []
};
