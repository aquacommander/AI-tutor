import type { Config } from 'tailwindcss';

/**
 * Design tokens for AI for Kids.
 *
 * These hex values are the source of truth for Tailwind utilities. The same
 * palette is mirrored as CSS custom properties in `src/app/globals.css` for
 * raw-CSS consumers (gradients, shadows, keyframes). Keep the two in sync.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Warm cream rather than a cool near-white: the whole page reads as
        // lamplight instead of screen glare. Every foreground token below was
        // re-checked against it at 4.5:1 or better.
        background: '#fff8f0',
        surface: '#ffffff',
        parchment: '#fdf2e3',

        ink: {
          DEFAULT: '#2a1a47',
          soft: '#5f5266',
          muted: '#6f6479',
        },

        primary: {
          DEFAULT: '#7148f5',
          dark: '#4c2bc6',
          light: '#eee9ff',
          surface: '#f1edff',
        },
        sky: {
          DEFAULT: '#2498f5',
          // `dark` variants exist so text can sit on the matching `light`
          // surface at 4.5:1 or better. Never pair DEFAULT with light.
          dark: '#0b5ea8',
          light: '#dff3ff',
          surface: '#edf6ff',
        },
        grass: {
          DEFAULT: '#29b866',
          dark: '#0f7440',
          light: '#eaf9f1',
          surface: '#edf9f3',
        },
        coral: {
          DEFAULT: '#ff6f66',
          dark: '#c2372d',
          light: '#fff0ec',
          surface: '#fff1eb',
        },
        sunshine: {
          DEFAULT: '#ffc83d',
          dark: '#8f5c00',
          light: '#fff7da',
        },

        'border-soft': '#ecddcd',
      },

      fontFamily: {
        heading: ['var(--font-heading)', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        button: '999px',
        card: '24px',
        large: '32px',
      },

      boxShadow: {
        // Shadows are tinted warm brown, not blue-grey, so cards feel lit by
        // the same light as the background.
        card: '0 16px 40px rgba(90, 60, 30, 0.10)',
        'card-hover': '0 22px 52px rgba(90, 60, 30, 0.17)',
        button: '0 10px 24px rgba(96, 65, 224, 0.25)',
        header: '0 10px 30px rgba(90, 60, 30, 0.09)',
      },

      maxWidth: {
        content: '1240px',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // The three dots that show Sparky is composing a reply.
        thinking: {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '40%': { opacity: '1', transform: 'translateY(-4px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        twinkle: 'twinkle 3.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        thinking: 'thinking 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
