import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No backend: everything ships as static assets.
// Vitest is configured inline so the engine tests need no DOM.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
  },
});
