module.exports = {
  // ... 기존 설정
  extend: {
    animation: {
      "float-slow": "float 8s ease-in-out infinite",
      "float-medium": "float 6s ease-in-out infinite",
      "float-fast": "float 4s ease-in-out infinite",
      "pulse-slow": "pulse 4s ease-in-out infinite",
      "bounce-gentle": "bounce 3s ease-in-out infinite",
      glow: "glow 2s ease-in-out infinite",
      scale: "scale 3s ease-in-out infinite",
      "rotate-slow": "rotate 15s linear infinite",
      shimmer: "shimmer 3s linear infinite",
      "slide-in": "slideIn 0.5s ease-out",
      "fade-in": "fadeIn 0.5s ease-out",
      fadeOut: 'fadeOut 1s ease-out forwards',
      fadeIn: 'fadeIn 1s ease-out forwards'
    },
    keyframes: {
      float: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-20px)" },
      },
      pulse: {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.5 },
      },
      glow: {
        "0%, 100%": { filter: "brightness(1)" },
        "50%": { filter: "brightness(1.5)" },
      },
      scale: {
        "0%, 100%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.05)" },
      },
      rotate: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
      shimmer: {
        "0%": { backgroundPosition: "-200%" },
        "100%": { backgroundPosition: "200%" },
      },
      slideIn: {
        "0%": { transform: "translateY(-20px)", opacity: 0 },
        "100%": { transform: "translateY(0)", opacity: 1 },
      },
      fadeOut: {
        '0%': { opacity: '1', transform: 'scale(1)' },
        '100%': { opacity: '0', transform: 'scale(0.8)' }
      },
      fadeIn: {
        '0%': { opacity: '0', transform: 'scale(0.8)' },
        '100%': { opacity: '1', transform: 'scale(1)' }
      },
    },
  },
  backgroundImage: {
    shimmer:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
  },
};
