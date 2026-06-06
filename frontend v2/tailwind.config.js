/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}", // Include all files in case components are at root
  ],
  theme: {
    extend: {
      // Custom animations for loading screens and other components
      animation: {
        // Default Tailwind animations (included for reference)
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",

        // Custom animations for loading screens
        "loading-bar": "loading-bar 1.5s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-in",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },

      // Custom keyframes
      keyframes: {
        // Loading bar animation (slides left to right)
        "loading-bar": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },

        // Fade in animation
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        // Slide up animation
        "slide-up": {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },

        // Slide down animation
        "slide-down": {
          "0%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },

        // Scale in animation
        "scale-in": {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },

      // Custom colors (if you need to customize indigo/teal further)
      colors: {
        // You can add custom color variations here if needed
        // These extend the default Tailwind colors
        indigo: {
          // Default Tailwind indigo colors are already available
          // 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
        },
        teal: {
          // Default Tailwind teal colors are already available
          // 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
        },
      },

      // Custom spacing (if needed)
      spacing: {
        // Extend default spacing scale if needed
        // '128': '32rem',
        // '144': '36rem',
      },

      // Custom border radius
      borderRadius: {
        // Extend default border radius if needed
        // '4xl': '2rem',
      },

      // Custom shadows
      boxShadow: {
        // Extend default shadows if needed
        // 'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
      },

      // Custom transitions
      transitionDuration: {
        // Extend default durations if needed
        // '2000': '2000ms',
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here if needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
