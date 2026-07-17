/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'shake': {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '20%': { transform: 'translateX(-4px) rotate(-1deg)' },
          '40%': { transform: 'translateX(4px) rotate(1deg)' },
          '60%': { transform: 'translateX(-3px) rotate(-1deg)' },
          '80%': { transform: 'translateX(3px) rotate(1deg)' },
        },
        'flash': {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'pop': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '40%': { transform: 'scale(1.3)', opacity: '1' },
          '60%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'combo-pop': {
          '0%': { transform: 'scale(0.5) rotate(-8deg)', opacity: '0' },
          '50%': { transform: 'scale(1.4) rotate(4deg)', opacity: '1' },
          '70%': { transform: 'scale(0.9) rotate(-2deg)' },
          '100%': { transform: 'scale(1.1) rotate(0deg)', opacity: '0' },
        },
        'crack': {
          '0%': { opacity: '0', transform: 'scale(1.5)' },
          '15%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1)' },
        },
        'rainbow-bg': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.08)' },
          '40%': { transform: 'scale(1)' },
          '55%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px 2px rgba(255,215,0,0.6)' },
          '50%': { boxShadow: '0 0 25px 8px rgba(255,215,0,0.95)' },
        },
        'slide-in-cutin': {
          '0%': { transform: 'translateX(120%) rotate(6deg)', opacity: '0' },
          '60%': { transform: 'translateX(-4%) rotate(-2deg)', opacity: '1' },
          '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
        },
        'particle-burst': {
          '0%': { transform: 'translate(0,0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--px), var(--py)) scale(0)', opacity: '0' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        flash: 'flash 0.5s ease-out forwards',
        pop: 'pop 0.3s ease-out forwards',
        'combo-pop': 'combo-pop 0.6s ease-out forwards',
        crack: 'crack 0.5s ease-out forwards',
        'rainbow-bg': 'rainbow-bg 3s linear infinite',
        heartbeat: 'heartbeat 1s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 1.2s ease-in-out infinite',
        'slide-in-cutin': 'slide-in-cutin 0.5s cubic-bezier(0.17,0.89,0.32,1.28) forwards',
        'particle-burst': 'particle-burst 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
