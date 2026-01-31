import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: '#5a189a',
        fuchsia: '#f72585',
        blush: '#ffb3d9',
        cream: '#fff4f9',
        lavender: '#cdb4ff'
      },
      boxShadow: {
        soft: '0 20px 40px rgba(90,24,154,0.15)'
      }
    }
  },
  plugins: []
};

export default config;
