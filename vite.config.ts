import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Code-splitting: Vite/Rollup automatically splits dynamic import() boundaries
// (see src/app/router.tsx, which lazy-loads every feature route). manualChunks
// below additionally isolates heavy, rarely-changing vendor libraries so app
// code can ship/invalidate independently of them.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-grid': ['ag-grid-community', 'ag-grid-react'],
          'vendor-charts': ['recharts'],
          'vendor-forms': ['formik', 'yup'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  server: {
    port: 5173,
  },
});
