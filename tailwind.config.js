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
          DEFAULT: 'oklch(0.165 0.005 240 / <alpha-value>)',
          subtle: 'oklch(0.185 0.005 240 / <alpha-value>)',
          surface: 'oklch(0.215 0.006 240 / <alpha-value>)',
          elevated: 'oklch(0.245 0.007 240 / <alpha-value>)'
        },
        border: {
          DEFAULT: 'oklch(0.285 0.006 240 / <alpha-value>)',
          strong: 'oklch(0.36 0.008 240 / <alpha-value>)'
        },
        fg: {
          DEFAULT: 'oklch(0.97 0.005 240 / <alpha-value>)',
          muted: 'oklch(0.72 0.010 240 / <alpha-value>)',
          dim: 'oklch(0.50 0.010 240 / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(0.78 0.150 75 / <alpha-value>)',
          hover: 'oklch(0.84 0.140 75 / <alpha-value>)',
          fg: 'oklch(0.18 0.025 75 / <alpha-value>)',
          soft: 'oklch(0.30 0.060 75 / <alpha-value>)'
        },
        danger: {
          DEFAULT: 'oklch(0.65 0.22 25 / <alpha-value>)',
          soft: 'oklch(0.32 0.080 25 / <alpha-value>)'
        },
        success: {
          DEFAULT: 'oklch(0.75 0.16 145 / <alpha-value>)',
          soft: 'oklch(0.28 0.060 145 / <alpha-value>)'
        },
        info: {
          DEFAULT: 'oklch(0.72 0.10 220 / <alpha-value>)',
          soft: 'oklch(0.28 0.040 220 / <alpha-value>)'
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
