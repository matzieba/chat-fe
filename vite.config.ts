/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public/',
  resolve:{
    alias:{
      '@cvt': path.resolve(__dirname, 'src/core'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
  },
});
