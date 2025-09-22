import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };
  
  return {
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      external: ['rollup']
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom'],
  },
  esbuild: {
    target: 'esnext'
  }
  };
});
