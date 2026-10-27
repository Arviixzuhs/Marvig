import { heroui } from '@heroui/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        kawaii: {
          extend: 'light',
          colors: {
            background: '#FFF5F7',
            foreground: '#4A2834',
            content1: '#FFFFFF',
            content2: '#FFE3E9',
            content3: '#FFB8C6',
            content4: '#FF8DA1',
            primary: {
              DEFAULT: '#FF6B8B',
              foreground: '#FFFFFF',
            },
            secondary: {
              DEFAULT: '#E8D5FF',
              foreground: '#5A3E78',
            },
            default: {
              50: '#FFF9FA',
              100: '#FFEDF1',
              200: '#FFD6E0',
              300: '#FFAEC1',
              400: '#FF85A0',
              500: '#FF5C81',
              600: '#E63962',
              700: '#B81D43',
              800: '#8A102E',
              900: '#4A2834',
              DEFAULT: '#FFD6E0',
            },
          },
        },

        dark: {
          colors: {
            content1: '#121212',
            content2: '#1a1a1a',
            content3: '#242424',
            content4: '#2e2e2e',
            default: {
              50: '#121212',
              100: '#1a1a1a',
              200: '#262626',
              300: '#383838',
              400: '#525252',
              500: '#737373',
              600: '#a3a3a3',
              700: '#d4d4d4',
              800: '#e5e5e5',
              900: '#fafafa',
              DEFAULT: '#262626',
            },
            primary: {
              DEFAULT: '#fafafa',
              foreground: '#0d0d0d',
            },
            focus: '#d4d4d4',
          },
        },
      },
    }),
  ],
}
