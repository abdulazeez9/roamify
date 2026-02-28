import { defineConfig } from '@chakra-ui/react';

export const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#196469' },
        secondary: { value: '#FFFF00' },
        dark: { value: '#141414' },
        surface: { value: '#F1F5EB' },
        textPrimary: { value: '#e6e6e6' },
        textInverse: { value: '#FFFFFF' },
      },
      fonts: {
        body: { value: 'var(--font-geist-sans), sans-serif' },
        heading: { value: 'var(--font-geist-sans), sans-serif' },
        mono: { value: 'var(--font-geist-mono), monospace' },
      },
    },
  },
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      width: '100%',
      height: '100%',
    },
    '*': {
      boxSizing: 'border-box',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
});
