import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // API_KEY for development mode only
        // In production, set BACKEND_API_URL instead
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY),
        // Backend URL for production mode
        'process.env.BACKEND_API_URL': JSON.stringify(env.BACKEND_API_URL || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
