import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const BACKEND_TARGET = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        configure: (proxy) => {
          // Without this, an unreachable backend surfaces to the browser as a
          // bare HTTP 500 with an empty body, which reads like an application
          // bug. Answer with an explicit 503 that names the real problem.
          proxy.on('error', (err, req, res) => {
            const detail =
              `Cannot reach the Well Twin API at ${BACKEND_TARGET} (${(err as NodeJS.ErrnoException).code || err.message}). ` +
              `Start the backend: cd backend && venv/Scripts/uvicorn app.main:app --reload --port 8000`;

            console.error(`\n[vite-proxy] ${req.method} ${req.url} -> ${detail}\n`);

            if ('writeHead' in res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ detail }));
            } else {
              res.end();
            }
          });
        },
      },
    },
  },
});
