// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
   theme: {
    extend: {
      keyframes: {
        micPulse: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.4' },
          '100%': { transform: 'translate(-50%, -50%) scale(2)', opacity: '0' },
        },
      },
      animation: {
        micPing: 'micPulse 1.5s ease-out infinite',
      },
    },
  },
  plugins: [],
}
