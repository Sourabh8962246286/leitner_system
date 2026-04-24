import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '^/auth(?!\\.)': 'http://localhost:3000',
      '^/cards(?!\\.)': 'http://localhost:3000',
      '^/boxes(?!\\.)': 'http://localhost:3000',
      '^/subjects(?!\\.)': 'http://localhost:3000',
      '^/tags(?!\\.)': 'http://localhost:3000',
    },
  },
});
