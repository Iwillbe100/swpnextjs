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
        micPulse: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.4' },
          '100%': { transform: 'translate(-50%, -50%) scale(2)', opacity: '0' },
        },
      },
      animation: {
        micPing: 'micPulse 1.5s ease-out infinite',
        float: 'float 10s ease-in-out infinite',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
