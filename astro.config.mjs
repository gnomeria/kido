import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [],
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
});