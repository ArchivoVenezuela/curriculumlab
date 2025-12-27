/**
 * Vite config for static export
 * 
 * This configuration builds a static, read-only version
 * of the course using static-export.tsx as entry point.
 */

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-static',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'static.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});

