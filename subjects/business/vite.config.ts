import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'business-dev-entries',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const [pathname, query] = (req.url || '').split('?');
          if (['/', '/index.html', '/Business.html'].includes(pathname)) {
            req.url = query ? `/app.html?${query}` : '/app.html';
          }
          next();
        });
      },
    },
  ],
  worker: { format: 'es' },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./app.html', import.meta.url)),
      },
    },
  },
});
