import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  // Use root path '/' on Vercel, but '/eventrent/' on GitHub Pages
  base: process.env.VERCEL ? '/' : '/eventrent/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
