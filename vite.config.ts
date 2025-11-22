import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const backendUrl = env.BACKEND_API_URL || '';
    const apiKey = env.GEMINI_API_KEY || env.API_KEY || '';
    
    // Security warning: API key should not be included when using backend proxy
    if (backendUrl && apiKey && mode === 'production') {
      console.warn('\n⚠️  WARNING: Both BACKEND_API_URL and API_KEY are set in production mode.');
      console.warn('⚠️  The API_KEY will be excluded from the bundle for security.');
      console.warn('⚠️  Only BACKEND_API_URL should be set in production.\n');
    }
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // In production with backend proxy, don't include API key
        // In development without backend proxy, include API key
        'process.env.API_KEY': JSON.stringify(backendUrl && mode === 'production' ? undefined : apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(backendUrl && mode === 'production' ? undefined : apiKey),
        // Backend URL for production mode
        'process.env.BACKEND_API_URL': JSON.stringify(backendUrl)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
