import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const allowViteDevelopmentBootstrap = (): Plugin => ({
  name: 'allow-vite-development-bootstrap',
  apply: 'serve',
  transformIndexHtml(html) {
    return html.replace(
      "script-src 'self' https://www.youtube.com",
      "script-src 'self' 'unsafe-inline' https://www.youtube.com",
    );
  },
});

export default defineConfig({
    plugins: [allowViteDevelopmentBootstrap(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR can be disabled in automated environments that do not support file watching.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
});
