import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback: if API server not running, return error
          proxy.on('error', (err, req, res) => {
            console.warn('API proxy error:', err.message);
            res.writeHead(503, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({
              error: 'API server not running. Please deploy to Vercel or run: npx vercel dev'
            }));
          });
        }
      }
    }
  }
});
