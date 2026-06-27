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
            content1: '#040c13',
            content2: '#19161b',
            content3: '#221e25',
            content4: '#2d2831',
            default: {
              50: '#11131f',
              100: '#191d2d',
              200: '#23293d',
              300: '#313953',
              400: '#4c5775',
              500: '#6f7b9c',
              600: '#9ca7c5',
              700: '#c3cbdf',
              800: '#e3e6f0',
              900: '#f4f5f9',
              DEFAULT: '#23293d',
            },
          },
        },
      },
    }),
  ],
}
