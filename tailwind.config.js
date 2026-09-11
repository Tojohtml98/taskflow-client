/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif']
      },
      colors: {
        bg: {
          DEFAULT: 'oklch(0.985 0.004 85 / <alpha-value>)',
          subtle: 'oklch(0.965 0.006 85 / <alpha-value>)',
          surface: 'oklch(0.94 0.008 85 / <alpha-value>)',
          elevated: 'oklch(0.905 0.010 85 / <alpha-value>)'
        },
        border: {
          DEFAULT: 'oklch(0.87 0.008 85 / <alpha-value>)',
          strong: 'oklch(0.76 0.012 85 / <alpha-value>)'
        },
        fg: {
          DEFAULT: 'oklch(0.22 0.008 85 / <alpha-value>)',
          muted: 'oklch(0.42 0.010 85 / <alpha-value>)',
          dim: 'oklch(0.58 0.010 85 / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(0.52 0.14 196 / <alpha-value>)',
          hover: 'oklch(0.44 0.15 196 / <alpha-value>)',
          fg: 'oklch(0.99 0.003 196 / <alpha-value>)',
          soft: 'oklch(0.93 0.045 196 / <alpha-value>)'
        },
        danger: {
          DEFAULT: 'oklch(0.50 0.19 25 / <alpha-value>)',
          soft: 'oklch(0.94 0.035 25 / <alpha-value>)'
        },
        success: {
          DEFAULT: 'oklch(0.45 0.13 165 / <alpha-value>)',
          soft: 'oklch(0.93 0.035 165 / <alpha-value>)'
        },
        info: {
          DEFAULT: 'oklch(0.48 0.12 220 / <alpha-value>)',
          soft: 'oklch(0.93 0.03 220 / <alpha-value>)'
        }
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1.125rem'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 240ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
}
