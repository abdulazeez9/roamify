import { defineConfig } from '@chakra-ui/react';

export const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#4A1D96' },
        secondary: { value: '#F97316' },
        dark: { value: '#0F0A1E' },
        surface: { value: '#F5F3FF' },
        textPrimary: { value: '#E9D5FF' },
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
