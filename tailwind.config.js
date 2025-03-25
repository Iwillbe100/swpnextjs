// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-60px)' }, // ← 커졌음!
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-50px)' }, // ← 커졌음!
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
